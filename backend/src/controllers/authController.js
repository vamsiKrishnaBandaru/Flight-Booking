const { supabase } = require('../../config/supabase');

// User signup
const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required',
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName },
      },
    });

    if (error) {
      // This will catch if the user already exists in Supabase Auth
      return res.status(409).json({ success: false, message: error.message });
    }

    // This function is defined in 00_INIT_DATABASE.sql and handles the insert.
    // We don't need to manually insert here if the trigger is working.
    // If the trigger fails, the auth user might exist without a public user profile.

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email to verify.',
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ success: false, message: error.message });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
  }
};

module.exports = {
  signup,
  login,
}; 