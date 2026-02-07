import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [form, setForm] = useState({
    name: '',
    jobRole: '',
    education: '',
    experience: '',
    skills: '',
  });
  const [generatedResume, setGeneratedResume] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResume('');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to generate resume.');
      } else {
        setGeneratedResume(data.generatedResume);
      }
    } catch (error) {
      console.error(error);
      alert('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Resume Builder</h1>

      <form onSubmit={handleGenerate} style={{ display: 'grid', gap: 10 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="jobRole" placeholder="Target Job Role" value={form.jobRole} onChange={handleChange} />
        <textarea name="education" placeholder="Education" value={form.education} onChange={handleChange} rows={3} />
        <textarea name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} rows={4} />
        <textarea name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} rows={2} />

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Resume'}
        </button>
      </form>

      <h2 style={{ marginTop: 20 }}>Generated Resume</h2>
      <pre style={{ background: '#f4f4f4', padding: 12, whiteSpace: 'pre-wrap' }}>
        {generatedResume || 'Your generated resume will appear here.'}
      </pre>
    </div>
  );
}

export default App;
