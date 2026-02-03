import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

async function createAdminUser() {
  try {
    console.log('\n=== SAGE Admin User Setup ===\n');

    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (email.length === 0 || password.length < 6) {
      console.error('\n❌ Invalid input. Email is required and password must be at least 6 characters.');
      process.exit(1);
    }

    console.log('\n📧 Creating user...');

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('User already registered')) {
        console.log('⚠️  User already exists. Retrieving existing user...');

        // Get the user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          throw listError;
        }

        const existingUser = users.find((u) => u.email === email);
        
        if (!existingUser) {
          console.error('❌ Could not find existing user');
          process.exit(1);
        }

        // Assign admin role to existing user
        console.log('👤 Assigning admin role...');
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: existingUser.id,
            role: 'admin',
          });

        if (roleError) {
          throw roleError;
        }

        console.log('\n✅ Admin role assigned successfully!');
        console.log(`\nEmail: ${email}`);
        console.log(`User ID: ${existingUser.id}`);
        console.log(`\nYou can now login at: /admin/login\n`);
      } else {
        throw authError;
      }
    } else if (authData.user) {
      // Assign admin role to new user
      console.log('👤 Assigning admin role...');
      
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'admin',
        });

      if (roleError) {
        throw roleError;
      }

      console.log('\n✅ Admin user created successfully!');
      console.log(`\nEmail: ${email}`);
      console.log(`User ID: ${authData.user.id}`);
      console.log(`\nYou can now login at: /admin/login\n`);
    }
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdminUser();
