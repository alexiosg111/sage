import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();

    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('sb-access-token');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}
