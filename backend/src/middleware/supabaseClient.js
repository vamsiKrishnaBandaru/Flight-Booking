const { createClient } = require('@supabase/supabase-js');

// This middleware creates a new Supabase client for each request,
// authenticated with the user's JWT if it exists.
const createSupabaseClient = (req, res, next) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const token = req.headers.authorization;

    // If there is no token, create a generic client.
    // This is for public routes like flight search.
    if (!token) {
      req.supabase = createClient(supabaseUrl, supabaseAnonKey);
      return next();
    }

    // If a token exists, create a new client authenticated with that token.
    // This ensures all subsequent database calls are made in the user's context.
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: token,
        },
      },
    });
    
    req.supabase = client;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create Supabase client',
    });
  }
};

module.exports = createSupabaseClient; 