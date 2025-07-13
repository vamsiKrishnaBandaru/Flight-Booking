const { supabase } = require('../../config/supabase');

// Get all airports
async function getAllAirports(req, res) {
  try {
    const { data, error } = await supabase
      .from('Airports')
      .select('*')
      .order('city', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search airports
async function searchAirports(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: 'Query parameter is required' });
    }

    const { data, error } = await supabase
      .from('Airports')
      .select('*')
      .or(`code.ilike.%${query}%,city.ilike.%${query}%,country.ilike.%${query}%,name.ilike.%${query}%`)
      .order('city', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get airport by ID
async function getAirportById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('Airports')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Airport not found' });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAirports,
  searchAirports,
  getAirportById
};
