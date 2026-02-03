# Testing Guide - Admin Panel Extensions

This guide provides step-by-step instructions to test all the new admin panel features.

## Prerequisites

Before testing, ensure:
- ✅ Dependencies installed: `pnpm install`
- ✅ Environment variables configured in `apps/web/.env.local`
- ✅ Storage bucket created in Supabase
- ✅ Admin user created: `pnpm seed:admin`
- ✅ Development server running: `pnpm dev`

## Test Cases

### 1. Authentication Tests

#### Test 1.1: Unprotected Route Access
**Steps:**
1. Open browser in incognito/private mode
2. Navigate to `http://localhost:3000/admin`
3. Navigate to `http://localhost:3000/admin/products`
4. Navigate to `http://localhost:3000/admin/analytics`

**Expected Result:**
- All routes should redirect to `/admin/login`
- No admin content should be visible

#### Test 1.2: Login with Valid Credentials
**Steps:**
1. Go to `http://localhost:3000/admin/login`
2. Enter valid admin email and password
3. Click "Sign In"

**Expected Result:**
- Should redirect to `/admin`
- Dashboard should load with stats
- Sidebar should show all menu items
- No error messages

#### Test 1.3: Login with Invalid Credentials
**Steps:**
1. Go to `http://localhost:3000/admin/login`
2. Enter invalid email or password
3. Click "Sign In"

**Expected Result:**
- Should show error message "Invalid email or password"
- Should not redirect
- Form should remain visible

#### Test 1.4: Non-Admin User Login
**Steps:**
1. Create a regular user in Supabase (without admin role)
2. Try to login at `/admin/login`

**Expected Result:**
- Should show error "Access denied. Admin privileges required"
- Should not grant access to admin panel

#### Test 1.5: Logout Functionality
**Steps:**
1. Login as admin
2. Navigate to any admin page
3. Click "Logout" in sidebar

**Expected Result:**
- Should redirect to `/admin/login`
- Should clear session
- Should not be able to access admin routes without re-login

#### Test 1.6: Session Persistence
**Steps:**
1. Login as admin
2. Refresh the page (F5)
3. Navigate between admin pages

**Expected Result:**
- Should stay logged in
- Should not redirect to login
- All pages should load correctly

---

### 2. Image Upload Tests

#### Test 2.1: Drag and Drop Upload (Product)
**Steps:**
1. Login as admin
2. Go to `/admin/products/new`
3. Find the image upload section
4. Drag an image file onto the upload area
5. Verify preview appears
6. Fill other required fields
7. Click "Create Product"

**Expected Result:**
- Image should upload successfully
- Preview should show the image
- Product should be created
- Image should appear in products list

#### Test 2.2: Click to Upload (Product)
**Steps:**
1. Go to `/admin/products/new`
2. Click on the upload area
3. Select an image file
4. Verify preview appears
5. Fill other required fields
6. Click "Create Product"

**Expected Result:**
- File picker should open
- Image should upload successfully
- Preview should show
- Product should be created with image

#### Test 2.3: URL Input (Product)
**Steps:**
1. Go to `/admin/products/new`
2. Enter a valid image URL in the text field
3. Verify preview appears
4. Fill other required fields
5. Click "Create Product"

**Expected Result:**
- Preview should load from URL
- Product should be created
- Image should display correctly

#### Test 2.4: Image Upload (Event)
**Steps:**
1. Go to `/admin/events/new`
2. Upload an image using drag & drop
3. Fill other required fields
4. Click "Create Event"

**Expected Result:**
- Image should upload successfully
- Event should be created with image
- Image should appear in events list

#### Test 2.5: Edit Product Image
**Steps:**
1. Go to `/admin/products`
2. Click "Edit" on a product with an image
3. Upload a new image
4. Click "Save Changes"

**Expected Result:**
- Old image should be replaced
- New image should be visible
- Product should update successfully

#### Test 2.6: Remove Image
**Steps:**
1. Edit a product or event with an image
2. Click the "X" button on the image preview
3. Save changes

**Expected Result:**
- Image should be removed
- Preview should disappear
- Product/Event should save without image

#### Test 2.7: File Validation - Invalid Type
**Steps:**
1. Go to `/admin/products/new`
2. Try to upload a non-image file (e.g., PDF, DOC)

**Expected Result:**
- Should show error "Only image files are allowed"
- File should not upload

#### Test 2.8: File Validation - Large File
**Steps:**
1. Try to upload an image larger than 5MB

**Expected Result:**
- Should show error "File size must be less than 5MB"
- File should not upload

#### Test 2.9: Supported Formats
**Test these image formats:**
- JPG/JPEG
- PNG
- GIF
- WEBP

**Expected Result:**
- All formats should upload successfully
- Preview should display correctly

#### Test 2.10: Image Display in Lists
**Steps:**
1. Create products with images
2. Go to `/admin/products`
3. Go to `/admin/events`

**Expected Result:**
- Images should display in table
- Images should have proper sizing
- Images should look good on dark background

---

### 3. Analytics Tests

#### Test 3.1: Dashboard Loads
**Steps:**
1. Login as admin
2. Go to `/admin/analytics`

**Expected Result:**
- Analytics page should load without errors
- All metric cards should display
- Charts should render
- No console errors

#### Test 3.2: Metrics Calculation
**Steps:**
1. Check each metric:
   - Total Revenue
   - Total Orders
   - Unique Customers
   - Conversion Rate

**Expected Result:**
- All metrics should have values (or 0 if no data)
- Values should be accurate based on database
- Format should be correct (€ for money, % for percentage)

#### Test 3.3: Revenue Chart
**Steps:**
1. Check the revenue trend chart
2. Hover over bars (if tooltips implemented)

**Expected Result:**
- Chart should show last 6 months
- Bars should have appropriate heights
- Labels should be readable
- Chart should be responsive

#### Test 3.4: Order Status Distribution
**Steps:**
1. Check the order status section
2. Verify progress bars

**Expected Result:**
- Should show completed, pending, cancelled
- Progress bars should be proportional
- Colors should match status (green, amber, red)

#### Test 3.5: Top Products
**Steps:**
1. Check the top products section
2. Verify product details

**Expected Result:**
- Should show top 5 products
- Should display product images
- Should show names, prices, and sales count
- Should show "No sales data yet" if no orders

#### Test 3.6: Recent Activity
**Steps:**
1. Check the recent activity section
2. Verify activity details

**Expected Result:**
- Should show recent orders
- Should display customer email
- Should show date and total
- Status badges should have correct colors

#### Test 3.7: Analytics with No Data
**Steps:**
1. Start with fresh database (no orders)
2. Go to `/admin/analytics`

**Expected Result:**
- All metrics should show 0
- Chart should render with no bars
- Should handle empty data gracefully
- Should not crash

#### Test 3.8: Analytics Updates
**Steps:**
1. Create a test order (via API or checkout)
2. Refresh analytics page

**Expected Result:**
- Metrics should update
- New order should appear in recent activity
- Revenue should increase

---

### 4. Integration Tests

#### Test 4.1: Full Product Workflow
**Steps:**
1. Login as admin
2. Create product with image
3. Edit product and change image
4. View product in products list
5. Delete product

**Expected Result:**
- All steps should work
- Images should display correctly
- Data should persist

#### Test 4.2: Full Event Workflow
**Steps:**
1. Login as admin
2. Create event with image
3. Edit event and change image
4. View event in events list
5. Delete event

**Expected Result:**
- All steps should work
- Images should display correctly
- Data should persist

#### Test 4.3: Navigation Flow
**Steps:**
1. Login
2. Navigate through all admin pages:
   - Dashboard
   - Analytics
   - Products
   - Events
   - Orders

**Expected Result:**
- All pages should load
- No broken links
- Active state should show correctly
- Back navigation should work

---

### 5. Responsive Design Tests

#### Test 5.1: Desktop View
**Steps:**
1. Open admin panel in desktop browser (1920x1080)

**Expected Result:**
- Sidebar should be visible on left
- Content area should take remaining space
- Tables should fit well
- Charts should be readable

#### Test 5.2: Tablet View
**Steps:**
1. Resize browser to tablet size (768x1024)

**Expected Result:**
- Layout should adjust
- Tables should be scrollable if needed
- Charts should resize
- All elements should be accessible

#### Test 5.3: Mobile View
**Steps:**
1. Resize browser to mobile size (375x667)

**Expected Result:**
- Layout should stack vertically
- Tables should be horizontally scrollable
- Charts should fit width
- Touch targets should be large enough

---

### 6. Security Tests

#### Test 6.1: Route Protection
**Steps:**
1. Try to access `/admin/products` without login (in incognito)
2. Try to access `/admin/analytics` without login

**Expected Result:**
- Should redirect to login
- Should not show admin data

#### Test 6.2: API Protection
**Steps:**
1. Try to call `/api/admin/upload` without authentication
2. Try to call `/api/admin/logout` without authentication

**Expected Result:**
- Should return error or redirect
- Should not perform operation

#### Test 6.3: Role Enforcement
**Steps:**
1. Create user without admin role
2. Try to login to admin panel

**Expected Result:**
- Should not allow access
- Should show permission error

---

## Test Data

### Sample Product Test Data
```
Name: Test Product 1
Slug: test-product-1
Price: 29.99
Stock: 100
Description: A test product for testing
Status: active
Image: Any test image (JPG/PNG under 5MB)
```

### Sample Event Test Data
```
Name: Test Event 1
Slug: test-event-1
Date: 2025-12-25
Ticket Price: 49.99
Ticket Stock: 50
Description: A test event for testing
Status: published
Image: Any test image (JPG/PNG under 5MB)
```

### Sample Admin Credentials
```
Email: admin@example.com
Password: admin123 (min 6 characters)
```

---

## Common Testing Issues

### Issue: "Missing environment variables"
**Solution:**
- Check `apps/web/.env.local` exists
- Verify all required variables are set
- Restart dev server after creating file

### Issue: "Storage bucket not found"
**Solution:**
- Run SQL commands to create bucket
- Check Supabase Storage section in dashboard
- Verify bucket name is 'images'

### Issue: "Upload failed"
**Solution:**
- Check file is under 5MB
- Verify file is an image
- Check network requests in DevTools
- Verify storage policies are correct

### Issue: "Middleware not protecting routes"
**Solution:**
- Check `middleware.ts` is in correct location (`apps/web/`)
- Verify Next.js version supports middleware
- Clear browser cache/cookies
- Check console for errors

---

## Browser Testing Checklist

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Performance Tests

### Check Page Load Times
- Login page: < 1 second
- Dashboard: < 2 seconds
- Analytics: < 3 seconds
- Product list: < 2 seconds

### Check Bundle Size
- Run `pnpm build`
- Check output for bundle sizes
- Total JavaScript should be reasonable (< 500KB gzipped)

---

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
- [ ] Alt text for images
- [ ] Form labels are present

---

## Success Criteria

All tests pass when:
- ✅ Authentication works correctly
- ✅ Image upload works for products and events
- ✅ Analytics displays accurate data
- ✅ Responsive design works on all screen sizes
- ✅ No console errors
- ✅ Security measures are effective
- ✅ User experience is smooth

---

**Next Steps:**
1. Run through all test cases
2. Document any issues found
3. Fix issues
4. Re-test
5. Deploy to staging environment

**Questions?**
Refer to:
- `IMPLEMENTATION_SUMMARY.md` for technical details
- `docs/ADMIN_PANEL_SETUP.md` for setup instructions
- `QUICK_START.md` for getting started
