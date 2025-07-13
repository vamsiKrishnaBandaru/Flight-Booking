const { supabase } = require('../config/supabase');

const email = 'demo@gmail.com';

(async () => {
  try {
    // Delete from Users table
    console.log('Deleting from Users table...');
    await supabase.from('Users').delete().eq('email', email);

    // Delete from Auth
    console.log('Deleting from Auth...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);
    
    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
      console.log('User deleted from Auth');
    } else {
      console.log('User not found in Auth');
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
})(); 