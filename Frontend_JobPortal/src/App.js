import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const api = axios.create({ baseURL: 'http://localhost:8080' });
const emptyJob = { postProfile: '', postDesc: '', reqExperience: 0, postTechStack: [] };
const accents = ['purple', 'blue', 'orange', 'green', 'pink'];

function AppContent() {
  // Keep credentials in memory only; signing out or refreshing clears them.
  const [account, setAccount] = useState(null);
  const [auth, setAuth] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedJobs') || '[]'); } catch { return []; }
  });
  const navigate = useNavigate();
  const loadJobs = async () => {
    setLoading(true);
    try { const { data } = await api.get('/jobPosts'); setJobs(data); setError(''); }
    catch { setError('We couldn’t load the jobs. Check your connection and try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadJobs(); }, []);
  useEffect(() => { localStorage.setItem('savedJobs', JSON.stringify(saved)); }, [saved]);
  const toggleSave = (id) => setSaved((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  const login = async (username, password) => {
    const credentials = { username, password };
    // Basic authentication validates supplied credentials even on this public endpoint.
    await api.get('/jobPosts', { auth: credentials });
    setAuth(credentials); setAccount(username);
  };
  const logout = () => { setAccount(null); setAuth(null); navigate('/'); };
  return <>
    <header className="header"><Link to="/" className="brand"><span className="brand-icon">j<span>↗</span></span> joblane<span className="brand-dot">.</span></Link>
      <nav aria-label="Main navigation"><NavLink to="/" end>Find a job</NavLink><NavLink to="/saved">Saved jobs <span className="count">{saved.length}</span></NavLink></nav>
      <div className="header-actions">{account ? <><span className="account-name">Hi, {account}</span><button className="text-button" onClick={logout}>Log out</button></> : <><Link className="text-button" to="/login">Log in</Link><Link className="button button-dark small" to="/register">Sign up <span>↗</span></Link></>}<Link className="post-link" to={account ? '/create' : '/login?next=create'}>Post a job ↗</Link></div>
    </header>
    <Routes>
      <Route path="/" element={<JobBoard {...{ jobs, saved, toggleSave, loading, error, loadJobs, account, auth }} />} />
      <Route path="/saved" element={<JobBoard {...{ jobs, saved, toggleSave, loading, error, loadJobs, account, auth }} savedOnly />} />
      <Route path="/login" element={<AuthPage login={login} />} />
      <Route path="/register" element={<AuthPage register login={login} />} />
      <Route path="/create" element={<JobForm {...{ account, auth, jobs, loadJobs }} />} />
      <Route path="/edit/:id" element={<JobForm {...{ account, auth, jobs, loadJobs }} />} />
      <Route path="*" element={<div className="empty-state"><h1>Let’s get you back on track.</h1><Link className="button button-dark" to="/">Explore jobs</Link></div>} />
    </Routes>
    <footer><Link to="/" className="brand">joblane.</Link><span>A little ambition. A world of possibility.</span><span>Made for your next chapter ↗</span></footer>
  </>;
}

function JobBoard({ jobs, saved, toggleSave, loading, error, loadJobs, savedOnly, account, auth }) {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [experience, setExperience] = useState('all');
  const [skill, setSkill] = useState('All skills');
  const [sort, setSort] = useState('latest');
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState('');
  const skills = [...new Set(jobs.flatMap((job) => job.postTechStack || []))];
  const filtered = jobs.filter((job) => (!savedOnly || saved.includes(job.postId)) && `${job.postProfile} ${job.postDesc} ${(job.postTechStack || []).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (skill === 'All skills' || (job.postTechStack || []).includes(skill)) && (experience === 'all' || (experience === 'early' ? job.reqExperience <= 2 : job.reqExperience >= 3))).sort((a, b) => sort === 'experience' ? a.reqExperience - b.reqExperience : b.postId - a.postId);
  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job permanently?')) return;
    try { await api.delete(`/jobPost/${id}`, { auth }); setSelected(null); await loadJobs(); }
    catch { setActionError('Unable to delete this job. Please log in again and retry.'); }
  };
  return <main>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> YOUR NEXT CHAPTER STARTS HERE</div><h1>{savedOnly ? <>Good opportunities.<br /><em>Worth keeping.</em></> : <>Big ambitions.<br /><em>Better opportunities.</em></>}</h1><p>Find work that feels like you. Explore opportunities,<br className="desktop" /> discover your next challenge, and make your move.</p><form className="search-bar" onSubmit={(e) => { e.preventDefault(); setSearch(query); }}><span aria-hidden="true" className="search-symbol">⌕</span><input aria-label="Job title or skill" placeholder="Job title, keyword, or skill" value={query} onChange={(e) => setQuery(e.target.value)} /><button className="button button-dark" type="submit">Find my next job <span>↗</span></button></form><div className="popular">Popular searches: {['React', 'Java', 'Python'].map((term) => <button key={term} onClick={() => { setQuery(term); setSearch(term); }}>{term} <span>↗</span></button>)}</div></div>
      <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-star">✳</div><div className="mini-note note-one"><span className="note-check">✓</span><div>Your next opportunity<strong>is closer than you think.</strong></div></div><div className="art-card"><div className="art-card-top"><span className="art-logo">↗</span><span>THE NEXT STEP</span><span>✧</span></div><h2>Do more<br />of what<br /><em>moves you.</em></h2><div className="art-card-bottom"><span>Find your place.</span><span>↗</span></div></div><div className="mini-note note-two"><span>✦</span><div>New possibilities.<strong>Every single day.</strong></div></div><div className="art-caption">A FRESH START LOOKS GOOD ON YOU</div></div>
    </section>
    <section className="trust-strip"><span>GOOD WORK STARTS<br /><strong>WITH THE RIGHT FIT.</strong></span><div>Build something meaningful</div><i>✦</i><div>Grow your potential</div><i>✦</i><div>Find your people</div></section>
    <section className="jobs-section"><div className="section-heading"><div className="eyebrow">THE OPPORTUNITY BOARD</div><h2>{savedOnly ? 'Your saved opportunities' : 'Your next move is here'}<span className="heading-dot">.</span></h2><p>{savedOnly ? 'A shortlist for your next big decision.' : 'Fresh roles. Real possibilities. Find the one that fits.'}</p></div>
      <div className="board-layout"><aside className="filters"><div className="filter-title"><h3>Refine your search</h3><button onClick={() => { setExperience('all'); setSkill('All skills'); setQuery(''); setSearch(''); }}>Reset</button></div><fieldset><legend>Experience level</legend>{[['all', 'All experience levels'], ['early', 'Early career · 0–2 years'], ['experienced', 'Experienced · 3+ years']].map(([value, label]) => <label key={value}><input type="radio" name="experience" value={value} checked={experience === value} onChange={() => setExperience(value)} />{label}</label>)}</fieldset><label className="select-label" htmlFor="skill">Skills & expertise</label><select id="skill" value={skill} onChange={(e) => setSkill(e.target.value)}><option>All skills</option>{skills.map((s) => <option key={s}>{s}</option>)}</select><div className="sidebar-note"><span>✧</span><h3>Your skills.<br />Your possibilities.</h3><p>A great next step starts with putting yourself out there.</p><Link to={account ? '/create' : '/register'}>{account ? 'Share an opportunity' : 'Create your account'} ↗</Link></div></aside>
      <div className="results"><div className="results-bar"><span><strong>{filtered.length}</strong> {savedOnly ? 'saved jobs' : 'opportunities'} for you</span><label>Sort by <select aria-label="Sort jobs" value={sort} onChange={(e) => setSort(e.target.value)}><option value="latest">Latest added</option><option value="experience">Experience</option></select></label></div>{(error || actionError) && <div className="notice error" role="alert">{error || actionError} <button onClick={loadJobs}>Retry</button></div>}
      {loading ? <div className="empty-state">Finding your next opportunity…</div> : filtered.length === 0 ? <div className="empty-state"><span>⌕</span><h3>{savedOnly ? 'Your shortlist starts here' : 'A new search, a new possibility'}</h3><p>{savedOnly ? 'Tap the bookmark on any job to save it for later.' : 'Try another keyword or reset your filters.'}</p>{savedOnly && <Link className="button button-dark" to="/">Explore jobs ↗</Link>}</div> : <div className="job-grid">{filtered.map((job, index) => <article className="job-card" key={job.postId}><div className="card-top"><div className={`job-logo ${accents[index % accents.length]}`}>{job.postProfile.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div><span className="opportunity-label">OPEN OPPORTUNITY</span><button className={`save-button ${saved.includes(job.postId) ? 'is-saved' : ''}`} aria-label={`${saved.includes(job.postId) ? 'Unsave' : 'Save'} ${job.postProfile}`} aria-pressed={saved.includes(job.postId)} onClick={() => toggleSave(job.postId)}><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z" /></svg></button></div><h3>{job.postProfile}</h3><div className="job-meta"><span>◷ {job.reqExperience}+ years experience</span><span>•</span><span>Technology</span></div><p className="job-description">{job.postDesc}</p><div className="skill-tags">{(job.postTechStack || []).map((s) => <span key={s}>{s}</span>)}</div><div className="card-bottom"><span>Find your next chapter</span><button onClick={() => { setSelected(job); setActionError(''); }}>View role <span>↗</span></button></div></article>)}</div>}
      <div className="end-note">✦ &nbsp; The right opportunity can change everything.</div></div></div>
    </section>
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="job-title" onClick={(e) => e.stopPropagation()}><button className="modal-close" aria-label="Close job details" onClick={() => setSelected(null)}>×</button><div className="eyebrow">YOUR NEXT POSSIBILITY</div><h2 id="job-title">{selected.postProfile}</h2><span className="pill">{selected.reqExperience}+ years experience</span><h3>About the opportunity</h3><p>{selected.postDesc}</p><h3>What you’ll bring</h3><div className="skill-tags">{(selected.postTechStack || []).map((s) => <span key={s}>{s}</span>)}</div><button className="button button-dark" onClick={() => toggleSave(selected.postId)}>{saved.includes(selected.postId) ? 'Remove from saved' : 'Save this opportunity'} ↗</button>{account && <div className="management"><Link to={`/edit/${selected.postId}`}>Edit job</Link><button onClick={() => deleteJob(selected.postId)}>Delete job</button></div>}</section></div>}
  </main>;
}

function AuthPage({ register, login }) {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const navigate = useNavigate();
  useEffect(() => { setError(''); setPassword(''); setConfirm(''); }, [register]);
  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (register && password !== confirm) { setError('Your passwords don’t match.'); return; }
    setBusy(true);
    try {
      if (register) await api.post('/register', { username: username.trim(), password });
      await login(username.trim(), password);
      navigate(new URLSearchParams(window.location.search).get('next') === 'create' ? '/create' : '/');
    } catch (err) { setError(err.response?.status === 409 ? 'That username is already taken. Try another one.' : err.response?.status === 401 ? 'Incorrect username or password.' : register ? 'Couldn’t create your account. Use a username of 3–40 letters, numbers, dots, dashes or underscores, and a password of 8–72 bytes.' : 'Unable to log in. Check your connection and try again.'); }
    finally { setBusy(false); }
  };
  return <main className="auth-layout"><section className="auth-story"><div className="eyebrow">YOUR FUTURE IS OPEN</div><h1>Good things<br />start with<br /><em>a first step.</em></h1><p>A new role. A fresh perspective.<br />A little closer to where you want to be.</p><span className="auth-star">✳</span><div className="auth-story-bottom">MAKE ROOM FOR WHAT’S NEXT. ↗</div></section><section className="auth-panel"><div className="eyebrow">{register ? 'LET’S GET YOU STARTED' : 'GOOD TO SEE YOU AGAIN'}</div><h2>{register ? 'Your next chapter awaits.' : 'Welcome back.'}</h2><p>{register ? 'Create your account and find your kind of work.' : 'Log in and pick up where you left off.'}</p><form onSubmit={submit}>{error && <div className="notice error" role="alert">{error}</div>}<label>Username<input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={40} pattern="[A-Za-z0-9_.\-]+" placeholder="Choose your username" /></label>{register && <small>3–40 letters, numbers, dots, dashes or underscores.</small>}<label>Password<input type="password" autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={register ? 8 : 1} placeholder={register ? 'At least 8 characters' : 'Enter your password'} /></label>{register && <label>Confirm password<input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="One more time" /></label>}<button className="button button-dark" disabled={busy}>{busy ? 'One moment…' : register ? 'Create account ↗' : 'Log in ↗'}</button></form><div className="auth-switch">{register ? 'Already have an account?' : 'New around here?'} <Link to={register ? '/login' : '/register'}>{register ? 'Log in' : 'Create an account'} ↗</Link></div><Link className="back-link" to="/">← Back to opportunities</Link></section></main>;
}

function JobForm({ account, auth, jobs, loadJobs }) {
  const { id } = useParams(); const navigate = useNavigate();
  const [form, setForm] = useState(emptyJob); const [skills, setSkills] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { if (id) { const job = jobs.find((j) => j.postId === Number(id)); if (job) { setForm(job); setSkills((job.postTechStack || []).join(', ')); } } else { setForm(emptyJob); setSkills(''); } }, [id, jobs]);
  if (!account) return <main className="empty-state"><h1>A great hire starts here.</h1><p>Log in to post or manage an opportunity.</p><Link className="button button-dark" to="/login?next=create">Log in ↗</Link></main>;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const payload = { ...form, postId: id ? Number(id) : Math.max(0, ...jobs.map((j) => j.postId)) + 1, reqExperience: Number(form.reqExperience), postTechStack: [...new Set(skills.split(',').map((s) => s.trim()).filter(Boolean))] };
      if (id) await api.put('/jobPost', payload, { auth }); else await api.post('/jobPost', payload, { auth });
      await loadJobs(); navigate('/');
    } catch { setError('Unable to save this job. Please log in again and retry.'); } finally { setBusy(false); }
  };
  return <main className="form-page"><div className="eyebrow">MAKE THE RIGHT CONNECTION</div><h1>{id ? 'A little fine-tuning.' : 'Someone’s next big step.'}</h1><p>{id ? 'Update your opportunity below.' : 'Share an opportunity worth discovering.'}</p><form className="editor-form" onSubmit={submit}>{error && <div className="notice error" role="alert">{error}</div>}<label>Job title<input required maxLength={100} value={form.postProfile} onChange={(e) => setForm({ ...form, postProfile: e.target.value })} placeholder="e.g. Frontend Developer" /></label><label>About the role<textarea required maxLength={255} rows={5} value={form.postDesc} onChange={(e) => setForm({ ...form, postDesc: e.target.value })} placeholder="What makes this opportunity special?" /></label><div className="form-columns"><label>Experience required (years)<input type="number" required min={0} max={50} value={form.reqExperience} onChange={(e) => setForm({ ...form, reqExperience: e.target.value })} /></label><label>Skills, separated by commas<input required value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, JavaScript, CSS" /></label></div><div className="form-actions"><Link to="/">Cancel</Link><button className="button button-dark" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes ↗' : 'Publish opportunity ↗'}</button></div></form></main>;
}

export default function App() { return <BrowserRouter><AppContent /></BrowserRouter>; }
