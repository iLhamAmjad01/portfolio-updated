import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowRight, Download, Calendar, Phone, Award, Clock, User,
    MapPin, Mail, ChevronLeft, ChevronRight, Star, CheckCircle,
    Loader2, ExternalLink, Code, Search, Send, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar.jsx';
import CmdPalette, { useCmdPaletteTrigger } from '../components/CmdPalette.jsx';
import FloatingWA from '../components/FloatingWA.jsx';
import SpotlightCard from '../components/SpotlightCard.jsx';

// Custom Typewriter Hook
const useTypewriter = (words, speed = 80, delay = 2200) => {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            timer = setTimeout(() => {
                setText(currentWord.substring(0, text.length - 1));
            }, speed / 2);
        } else {
            timer = setTimeout(() => {
                setText(currentWord.substring(0, text.length + 1));
            }, speed);
        }

        if (!isDeleting && text === currentWord) {
            timer = setTimeout(() => setIsDeleting(true), delay);
        } else if (isDeleting && text === '') {
            setIsDeleting(false);
            setWordIndex((wordIndex + 1) % words.length);
        }

        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, words, speed, delay]);

    return text;
};

// Viewport Triggered Counter
const AnimatedCounter = ({ end, duration = 1500, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !triggered) {
                setTriggered(true);
                let start = 0;
                const target = parseInt(end);
                const steps = duration / 16; // 60fps
                const increment = target / steps;

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= target) {
                        setCount(target);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, triggered]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const LandingPage = () => {
    const { isOpen: isCmdOpen, setIsOpen: setIsCmdOpen } = useCmdPaletteTrigger();
    const [portfolioData, setPortfolioData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search states for Projects
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProject, setSelectedProject] = useState(null); // Detailed Case Study Modal
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;

    // Contact Form State
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formFeedback, setFormFeedback] = useState({ type: '', msg: '' });

    // Testimonials Auto-Carousel
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    // Typewriter roles
    const typedRole = useTypewriter(['Full Stack Developer', 'UI/UX Designer', 'React Specialist', 'Node.js Engineer']);

    // Fetch portfolio landing aggregator data
    useEffect(() => {
        const loadPortfolio = async () => {
            try {
                const res = await fetch('/api/portfolio');
                const resData = await res.json();
                if (resData.success && resData.data) {
                    setPortfolioData(resData.data);
                }
            } catch (err) {
                console.error('Error fetching aggregated portfolio:', err);
            }
        };

        const loadProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                const resData = await res.json();
                if (resData.success && resData.data) {
                    setProjects(resData.data);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        // Track page view hits
        try {
            fetch('/api/analytics/hit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: '/' })
            });
        } catch (e) { }

        loadPortfolio();
        loadProjects();
    }, []);

    // Static Fallback Data in case DB is not yet populated
    const fallbackData = {
        settings: {
            hero: {
                tagline: 'Open to opportunities',
                titleFirst: 'Ilham',
                titleLast: 'Amjad.',
                bio: 'Full Stack Developer crafting high-performance web experiences with elegant interfaces and robust backend architecture. Based in Islamabad, Pakistan.',
                cvUrl: '#'
            },
            contactInfo: {
                email: 'ilhamamjad2211@gmail.com',
                phone: '+92 344 983 2866',
                whatsapp: '923449832866',
                location: 'Bahria Town, Islamabad, Pakistan'
            },
            socialLinks: {
                github: 'https://github.com/iLhamAmjad01',
                linkedin: '#'
            }
        },
        skills: [
            { name: 'HTML / CSS', proficiency: 90, category: 'Frontend' },
            { name: 'JavaScript', proficiency: 85, category: 'Frontend' },
            { name: 'React.js', proficiency: 80, category: 'Frontend' },
            { name: 'Node.js / Express', proficiency: 75, category: 'Backend' },
            { name: 'MongoDB / SQL', proficiency: 70, category: 'Database' },
            { name: 'UI/UX Design', proficiency: 78, category: 'Design' }
        ],
        experience: [
            { title: 'HTML / CSS Developer', company: 'Freelance', period: '2023 — 2025', description: ['Crafted semantic, accessible HTML structures and pixel-perfect layouts.', 'Optimized responsive structures for multiple mobile breakpoints.'] },
            { title: 'Node.js Developer', company: 'Digital Agency', period: '2024 — 2025', description: ['Built server-side applications and secure RESTful APIs using Express.js and MongoDB.', 'Configured JWT auth headers and error middleware filters.'] },
            { title: 'React Specialist', company: 'Startup Lab', period: '2023 — 2024', description: ['Created interactive single page apps with hooks and context states.'] }
        ],
        services: [
            { title: 'Web Development', description: 'Full-stack engineering with modern frameworks, performance optimisation, and secure APIs.', icon: 'Code', pricing: 'Starting at $800', features: ['React/Vite integration', 'Express API endpoints', 'MongoDB setup', 'Responsive design'] },
            { title: 'UI / UX Design', description: 'Beautiful, conversion-focused interfaces and high-fidelity wireframes in Figma.', icon: 'Figma', pricing: 'Starting at $400', features: ['Interactive prototypes', 'Clean grid alignment', 'Asset exporting'] }
        ],
        testimonials: [
            { name: 'John Smith', role: 'CEO', company: 'Tech Solutions', rating: 5, text: 'Ilham delivered an exceptional website that exceeded all expectations. His design sense and technical precision are outstanding.' },
            { name: 'Sarah Johnson', role: 'Founder', company: 'Digital Marketing Co', rating: 5, text: 'Working with Ilham was an absolute pleasure. He shipped our landing page well ahead of schedule.' }
        ]
    };

    const data = portfolioData || fallbackData;
    const heroData = data.settings?.hero || fallbackData.settings.hero;
    const contactInfo = data.settings?.contactInfo || fallbackData.settings.contactInfo;
    const socialLinks = data.settings?.socialLinks || fallbackData.settings.socialLinks;

    // Track key actions (CV Download, WhatsApp Clicks, Book Call)
    const trackClick = (elementId, label) => {
        try {
            fetch('/api/analytics/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ elementId, label })
            });
        } catch (e) { }
    };

    // CV Download Trigger
    const handleDownloadCV = () => {
        trackClick('download_cv', 'Download CV Hero Button');
        const a = document.createElement('a');
        // Using locally placed PDF in public folder (copy cv to public later)
        a.href = '/ilham_updated_cv.pdf';
        a.download = 'Ilham_Amjad_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Testimonials Auto Play
    useEffect(() => {
        if (!data.testimonials || data.testimonials.length === 0) return;
        const interval = setInterval(() => {
            setTestimonialIndex(prev => (prev + 1) % data.testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [data.testimonials]);

    // Contact Form Submission Handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormFeedback({ type: '', msg: '' });

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });
            const resData = await res.json();

            if (resData.success) {
                setFormFeedback({ type: 'success', msg: 'Message sent successfully! I will reply shortly.' });
                setFormState({ name: '', email: '', subject: '', message: '' });

                // Premium success explosion!
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.8 },
                    colors: ['#b5111f', '#c9843a', '#ffffff']
                });
            } else {
                setFormFeedback({ type: 'error', msg: resData.error || 'Failed to submit form. Please check your entries.' });
            }
        } catch (err) {
            setFormFeedback({ type: 'error', msg: 'Unable to connect to server. Please email directly.' });
        } finally {
            setFormLoading(false);
        }
    };

    // Filter projects by Search and Categories
    const filteredProjects = projects.filter(p => {
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.chips.some(chip => chip.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Pagination calculations
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Navbar onOpenCmdPalette={() => setIsCmdOpen(true)} />
            <CmdPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
            <FloatingWA />

            <main style={{ position: 'relative', zIndex: 1 }}>

                {/* ════════════════ HERO SECTION ════════════════ */}
                <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px', position: 'relative' }}>
                    <div className="wrap" style={{ width: '100%' }}>
                        <div className="grid-2" style={{ alignItems: 'center' }}>
                            <div>
                                {/* Availability Badge */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                                    border: '1px solid var(--border-neon)',
                                    padding: '6px 16px',
                                    borderRadius: '100px',
                                    fontSize: '0.72rem',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: 'var(--accent-hi)',
                                    marginBottom: '28px'
                                }}>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        backgroundColor: 'var(--accent-hi)',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                                    }}></span>
                                    {heroData.tagline}
                                </div>

                                {/* Animated Name */}
                                <h1 className="font-display" style={{
                                    fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
                                    fontWeight: 300,
                                    lineHeight: 0.95,
                                    marginBottom: '16px',
                                    letterSpacing: '-1px'
                                }}>
                                    {heroData.titleFirst} <br />
                                    <span className="gradient-text text-glow" style={{ fontStyle: 'italic', fontWeight: 400 }}>
                                        {heroData.titleLast}
                                    </span>
                                </h1>

                                {/* Role Typewriter */}
                                <div className="font-mono text-glow" style={{
                                    fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
                                    color: '#c9843a',
                                    marginBottom: '24px',
                                    letterSpacing: '2px',
                                    height: '30px'
                                }}>
                                    &gt; {typedRole}
                                    <span style={{
                                        animation: 'blink 1s step-end infinite',
                                        color: 'var(--accent-hi)',
                                        marginLeft: '2px',
                                        fontWeight: 'bold'
                                    }}>_</span>
                                </div>

                                {/* Bio text */}
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '1.05rem',
                                    lineHeight: 1.8,
                                    fontWeight: 300,
                                    maxWidth: '520px',
                                    marginBottom: '40px'
                                }}>
                                    {heroData.bio}
                                </p>

                                {/* Action CTAs */}
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <button onClick={handleDownloadCV} className="btn-primary">
                                        <Download size={16} /> Download CV
                                    </button>
                                    <a href="#contact" className="btn-secondary">
                                        Hire Me <ArrowRight size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Visual Portrait Card */}
                            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                <div style={{
                                    position: 'relative',
                                    width: 'min(100%, 420px)',
                                    aspectRatio: '0.82',
                                    borderRadius: 'var(--radius-xl)',
                                    border: '1px solid var(--border)',
                                    overflow: 'visible',
                                    background: 'linear-gradient(160deg, #111827 0%, #1f2937 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {/* Decorative background outline */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '-12px',
                                        right: '12px',
                                        bottom: '12px',
                                        border: '1px solid var(--border-neon)',
                                        borderRadius: 'var(--radius-xl)',
                                        zIndex: -1
                                    }} />

                                    {/* Profile Image (p1.png fallback to avatar gradient) */}
                                    <img
                                        src="/p1.png"
                                        alt="Ilham Amjad"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            document.getElementById('avatar-fallback').style.display = 'flex';
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--radius-xl)'
                                        }}
                                    />

                                    {/* Fallback Graphic Avatar */}
                                    <div
                                        id="avatar-fallback"
                                        style={{
                                            display: 'none',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 'var(--radius-xl)',
                                            background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.15) 0%, transparent 80%)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        <Code size={64} style={{ color: 'var(--accent)' }} />
                                        <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&lt;IA /&gt;</span>
                                    </div>

                                    {/* Floating Metrics Badge 1 */}
                                    <div className="glass animate-float" style={{
                                        position: 'absolute',
                                        left: '-24px',
                                        bottom: '60px',
                                        padding: '12px 20px',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        zIndex: 10
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--accent-hi)'
                                        }}>
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.2rem', lineHeight: 1 }}>
                                                <AnimatedCounter end="3" suffix="+" />
                                            </div>
                                            <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Exp</span>
                                        </div>
                                    </div>

                                    {/* Floating Metrics Badge 2 */}
                                    <div className="glass animate-float" style={{
                                        position: 'absolute',
                                        right: '-24px',
                                        top: '60px',
                                        padding: '12px 20px',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        zIndex: 10,
                                        animationDelay: '1.5s'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(201, 132, 58, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#c9843a'
                                        }}>
                                            <Award size={16} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.2rem', lineHeight: 1 }}>
                                                <AnimatedCounter end="20" suffix="+" />
                                            </div>
                                            <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════ TIMELINE & ABOUT SECTION ════════════════ */}
                <section id="about" className="sec-padding" style={{ borderTop: '1px solid var(--border)', background: 'rgba(17, 24, 39, 0.15)' }}>
                    <div className="wrap">
                        <div className="grid-2">
                            {/* About Prose */}
                            <div>
                                <div className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  // Professional Bio
                                </div>
                                <h2 className="font-display" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '28px' }}>
                                    Building with <br /><span className="gradient-text" style={{ fontStyle: 'italic' }}>Intention and Detail</span>
                                </h2>
                                <div style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: 300 }}>
                                    <p>
                                        I'm a Full Stack Developer based in Islamabad, Pakistan, specializing in high-performance React architectures, lightweight styling, and scalable backends.
                                    </p>
                                    <p>
                                        My core engineering principle is simple: write code optimized for clarity, performance, and accessibility. Whether parsing complex queries, designing glassmorphic card grids, or writing clean documentation, I dedicate focus to visual cleanups and strict rate limiting.
                                    </p>

                                    {/* Quote block */}
                                    <blockquote style={{
                                        borderLeft: '2px solid var(--accent-hi)',
                                        paddingLeft: '20px',
                                        margin: '12px 0',
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.35rem',
                                        color: 'var(--text)',
                                        fontStyle: 'italic',
                                        lineHeight: 1.4
                                    }}>
                                        "Refined design isn't just decoration. It is the visible structural integrity of a developer's codebase."
                                    </blockquote>

                                    {/* Quick stats grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} style={{ color: 'var(--accent-hi)' }} />
                                            <span style={{ fontSize: '0.85rem' }}>Islamabad, Pakistan</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Mail size={16} style={{ color: 'var(--accent-hi)' }} />
                                            <span style={{ fontSize: '0.85rem' }}>ilhamamjad2211@gmail.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Progress Card */}
                            <div>
                                <div className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  // Proficiency Grid
                                </div>
                                <h3 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '28px' }}>
                                    Technical Competence
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {data.skills.map((skill, index) => (
                                        <div key={index}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                                                <span style={{ fontWeight: 500 }}>{skill.name}</span>
                                                <span className="font-mono" style={{ color: 'var(--accent-hi)' }}>{skill.proficiency}%</span>
                                            </div>
                                            <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                                                {/* Progress Bar with CSS animation */}
                                                <div style={{
                                                    height: '100%',
                                                    width: `${skill.proficiency}%`,
                                                    background: 'var(--accent-gradient)',
                                                    borderRadius: '10px',
                                                    animation: 'slideInWidth 1.5s var(--ease-out) forwards'
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Career Timeline sub-section */}
                        <div style={{ marginTop: '90px' }} id="experience">
                            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                                <span className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Journey Timeline
                                </span>
                                <h3 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, marginTop: '8px' }}>
                                    Work Experience & Education
                                </h3>
                            </div>

                            <div style={{
                                position: 'relative',
                                maxWidth: '800px',
                                margin: '0 auto',
                                padding: '20px 0'
                            }}>
                                {/* Timeline center line */}
                                <div style={{
                                    position: 'absolute',
                                    left: '30px',
                                    top: 0,
                                    bottom: 0,
                                    width: '1px',
                                    backgroundColor: 'var(--border)'
                                }} className="md-timeline-center" />

                                {/* Timeline Cards */}
                                {data.experience.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: 'relative',
                                            paddingLeft: '70px',
                                            marginBottom: '40px'
                                        }}
                                        className="timeline-item"
                                    >
                                        {/* Circle Node indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '21px',
                                            top: '8px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--bg)',
                                            border: '2px solid var(--accent-hi)',
                                            boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.4)',
                                            zIndex: 2
                                        }} className="timeline-node" />

                                        {/* Card Body */}
                                        <SpotlightCard style={{ padding: '24px' }}>
                                            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-hi)', letterSpacing: '1px' }}>
                                                {item.period}
                                            </span>
                                            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                                                {item.title}
                                            </h4>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '14px', fontWeight: 500 }}>
                                                {item.company} {item.location && `| ${item.location}`}
                                            </div>

                                            <ul style={{ paddingLeft: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {item.description.map((point, idx) => (
                                                    <li key={idx}>{point}</li>
                                                ))}
                                            </ul>
                                        </SpotlightCard>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════ SERVICES SECTION ════════════════ */}
                <section id="services" className="sec-padding" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <div className="wrap">
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <span className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Offered Services
                            </span>
                            <h2 className="font-display" style={{ fontSize: '3rem', fontWeight: 300, marginTop: '8px' }}>
                                Engineering & Design
                            </h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '12px auto 0', fontSize: '0.95rem' }}>
                                Premium tailored packages backed by clean architecture and responsive visual layouts.
                            </p>
                        </div>

                        <div className="grid-3">
                            {data.services.map((srv, index) => (
                                <SpotlightCard key={index} style={{ padding: '36px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(var(--accent-rgb), 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-hi)',
                                        marginBottom: '24px'
                                    }}>
                                        <Code size={20} />
                                    </div>

                                    <h3 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 600, marginBottom: '12px' }}>
                                        {srv.title}
                                    </h3>

                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                                        {srv.description}
                                    </p>

                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: 'auto' }}>
                                        <div className="font-mono" style={{ fontSize: '0.75rem', color: '#c9843a', marginBottom: '12px' }}>
                                            {srv.pricing}
                                        </div>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                                            {srv.features?.map((f, idx) => (
                                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    <CheckCircle size={12} style={{ color: 'var(--accent-hi)' }} />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════ PROJECTS SECTION ════════════════ */}
                <section id="projects" className="sec-padding" style={{ borderTop: '1px solid var(--border)', background: 'rgba(17, 24, 39, 0.15)' }}>
                    <div className="wrap">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <span className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Selected Portfolio
                                </span>
                                <h2 className="font-display" style={{ fontSize: '3rem', fontWeight: 300, marginTop: '8px' }}>
                                    Featured Works
                                </h2>
                            </div>

                            {/* Filters & Search Controls */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {/* Search box */}
                                <div className="glass" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border)'
                                }}>
                                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search stack/tags..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            outline: 'none',
                                            color: 'var(--text)',
                                            fontSize: '0.85rem',
                                            fontFamily: 'var(--font-body)',
                                            width: '150px'
                                        }}
                                    />
                                </div>

                                {/* Category Pills */}
                                <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '4px', borderRadius: '8px' }}>
                                    {['All', 'Web Apps', 'Mobile Apps', 'Design'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: categoryFilter === cat ? 'var(--accent)' : 'transparent',
                                                color: categoryFilter === cat ? '#fff' : 'var(--text-muted)',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                fontFamily: 'var(--font-mono)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', width: '100%' }}>
                                <Loader2 size={36} className="fa-spin" style={{ color: 'var(--accent-hi)' }} />
                            </div>
                        ) : currentProjects.length === 0 ? (
                            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                No projects matched your criteria.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
                                {currentProjects.map(proj => (
                                    <SpotlightCard
                                        key={proj._id}
                                        onClick={() => { setSelectedProject(proj); trackClick('project_card_click', `View Case Study: ${proj.title}`); }}
                                        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                                    >
                                        {/* Media Thumbnail */}
                                        <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative', background: '#0a0d14' }}>
                                            <img
                                                src={proj.images?.[0] || '/spotifyclone.png'}
                                                alt={proj.title}
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600';
                                                }}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                backgroundColor: 'rgba(0,0,0,0.65)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text)',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                fontSize: '0.68rem',
                                                fontFamily: 'var(--font-mono)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {proj.tag}
                                            </div>
                                        </div>

                                        {/* Content info */}
                                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                                                {proj.title}
                                            </h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                                                {proj.description.slice(0, 110)}{proj.description.length > 110 ? '...' : ''}
                                            </p>

                                            {/* Tech Chips */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {proj.chips.slice(0, 4).map((c, i) => (
                                                    <span key={i} className="font-mono" style={{
                                                        fontSize: '0.62rem',
                                                        padding: '3px 8px',
                                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '4px',
                                                        color: 'var(--text-muted)'
                                                    }}>{c}</span>
                                                ))}
                                                {proj.chips.length > 4 && (
                                                    <span className="font-mono" style={{ fontSize: '0.62rem', padding: '3px 8px', color: 'var(--accent-hi)' }}>
                                                        +{proj.chips.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '50px' }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text)',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <button
                                        key={n}
                                        onClick={() => handlePageChange(n)}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border)',
                                            backgroundColor: currentPage === n ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
                                            color: '#fff',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {n}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text)',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ════════════════ TESTIMONIALS SECTION ════════════════ */}
                {data.testimonials && data.testimonials.length > 0 && (
                    <section id="testimonials" className="sec-padding" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                        <div className="wrap" style={{ maxWidth: '800px', textAlign: 'center' }}>
                            <span className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Client Endorsements
                            </span>
                            <h2 className="font-display" style={{ fontSize: '3rem', fontWeight: 300, marginTop: '8px', marginBottom: '40px' }}>
                                Client Feedback
                            </h2>

                            <div style={{ position: 'relative', minHeight: '260px' }}>
                                {data.testimonials.map((item, idx) => {
                                    if (idx !== testimonialIndex) return null;
                                    return (
                                        <div key={idx} style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                            <span className="font-display" style={{ fontSize: '7rem', color: 'rgba(var(--accent-rgb), 0.08)', position: 'absolute', top: '-60px', left: '10px', height: '0', pointerEvents: 'none' }}>“</span>

                                            <p style={{
                                                fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                                                fontWeight: 300,
                                                color: 'var(--text)',
                                                lineHeight: 1.6,
                                                marginBottom: '32px',
                                                position: 'relative',
                                                zIndex: 1
                                            }}>
                                                {item.text}
                                            </p>

                                            {/* Ratings stars */}
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} size={14} style={{
                                                        fill: i < item.rating ? '#c9843a' : 'none',
                                                        color: i < item.rating ? '#c9843a' : 'var(--border)'
                                                    }} />
                                                ))}
                                            </div>

                                            {/* Author */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                                <div style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border)',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {item.avatar ? (
                                                        <img src={item.avatar} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <User size={18} />
                                                    )}
                                                </div>
                                                <div style={{ textAlign: 'left' }}>
                                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</h4>
                                                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                        {item.role} {item.company && `@ ${item.company}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Slider dots */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                                {data.testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setTestimonialIndex(i)}
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            backgroundColor: testimonialIndex === i ? 'var(--accent-hi)' : 'var(--border)',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ════════════════ CONTACT SECTION ════════════════ */}
                <section id="contact" className="sec-padding" style={{ borderTop: '1px solid var(--border)', background: 'rgba(17, 24, 39, 0.15)' }}>
                    <div className="wrap">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '80px' }} className="grid-2">
                            <div>
                                <span className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Let's Connect
                                </span>
                                <h2 className="font-display" style={{ fontSize: '3rem', fontWeight: 300, marginTop: '8px', marginBottom: '24px' }}>
                                    Start a <br /><span className="gradient-text" style={{ fontStyle: 'italic' }}>Conversation</span>
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '40px', fontWeight: 300 }}>
                                    Have an application to build, APIs to secure, or layouts to clean up? Drop a message through the contact form or connect directly on WhatsApp. Typically replies within 5 minutes.
                                </p>

                                {/* Direct info cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="glass" style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '8px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '6px',
                                            backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--accent-hi)',
                                            flexShrink: 0
                                        }}>
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <span className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block' }}>Email Address</span>
                                            <a href={`mailto:${contactInfo.email}`} onClick={() => trackClick('contact_email_click', 'Mailto Click')} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hi)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="glass" style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '8px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '6px',
                                            backgroundColor: 'rgba(37, 211, 102, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#25D366',
                                            flexShrink: 0
                                        }}>
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <span className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block' }}>WhatsApp Direct</span>
                                            <a href={`https://wa.me/${contactInfo.whatsapp}`} onClick={() => trackClick('contact_wa_click', 'WhatsApp Form Click')} target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hi)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                                                {contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <SpotlightCard style={{ padding: '40px' }}>
                                <form onSubmit={handleFormSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }} className="grid-2-form">
                                        <div>
                                            <label className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Your Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Smith"
                                                value={formState.name}
                                                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    borderRadius: '6px',
                                                    border: '1px solid var(--border)',
                                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                                    color: 'var(--text)',
                                                    outline: 'none',
                                                    fontSize: '0.88rem'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formState.email}
                                                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    borderRadius: '6px',
                                                    border: '1px solid var(--border)',
                                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                                    color: 'var(--text)',
                                                    outline: 'none',
                                                    fontSize: '0.88rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Subject</label>
                                        <input
                                            type="text"
                                            placeholder="Project Discussion"
                                            value={formState.subject}
                                            onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '6px',
                                                border: '1px solid var(--border)',
                                                backgroundColor: 'rgba(255,255,255,0.02)',
                                                color: 'var(--text)',
                                                outline: 'none',
                                                fontSize: '0.88rem'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <label className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Message Details</label>
                                        <textarea
                                            placeholder="Tell me about your product requirements..."
                                            value={formState.message}
                                            onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                                            required
                                            rows={5}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '6px',
                                                border: '1px solid var(--border)',
                                                backgroundColor: 'rgba(255,255,255,0.02)',
                                                color: 'var(--text)',
                                                outline: 'none',
                                                fontSize: '0.88rem',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    {formFeedback.msg && (
                                        <div style={{
                                            padding: '12px 16px',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            marginBottom: '20px',
                                            border: '1px solid',
                                            backgroundColor: formFeedback.type === 'success' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            borderColor: formFeedback.type === 'success' ? '#22c55e' : '#ef4444',
                                            color: formFeedback.type === 'success' ? '#4ade80' : '#f87171'
                                        }}>
                                            {formFeedback.msg}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="btn-primary"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        {formLoading ? (
                                            <>
                                                <Loader2 size={16} className="fa-spin" /> Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} /> Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </SpotlightCard>
                        </div>
                    </div>
                </section>

            </main>

            {/* ════════════════ FOOTER ════════════════ */}
            <footer style={{
                background: 'rgba(3, 7, 18, 0.95)',
                borderTop: '1px solid var(--border)',
                padding: '5rem 0 3rem'
            }}>
                <div className="wrap">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px', borderBottom: '1px solid var(--border)', paddingBottom: '3rem', marginBottom: '2.5rem' }} className="grid-2">
                        <div>
                            <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 600, letterSpacing: '2px', marginBottom: '16px' }}>
                                IL<span style={{ color: 'var(--accent-hi)' }}>H</span>AM
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '320px', marginBottom: '24px', fontWeight: 300 }}>
                                Full-stack developer building visually detailed applications, performant Node backends, and robust schemas.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <a href={socialLinks.github} target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-hi)'; e.currentTarget.style.color = 'var(--text)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}><Code size={16} /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-hi)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Site Map</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                                {navLinks.map(n => (
                                    <li key={n.id}><a href={`#${n.id}`} onClick={e => handleNavClick(e, n.id)} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>{n.label}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-hi)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Contact</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <li>{contactInfo.location}</li>
                                <li><a href={`mailto:${contactInfo.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contactInfo.email}</a></li>
                                <li><a href={`https://wa.me/${contactInfo.whatsapp}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contactInfo.phone}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        <span>&copy; 2026 Ilham Amjad. All Rights Reserved.</span>
                        <span>Crafted with 💖 in Islamabad, Pakistan.</span>
                    </div>
                </div>
            </footer>

            {/* ════════════════ CASE STUDY / PROJECT DETAILS MODAL ════════════════ */}
            {selectedProject && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(15px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }} onClick={() => setSelectedProject(null)}>
                    <div
                        className="glass"
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border-hover)',
                            backgroundColor: 'rgba(10, 15, 26, 0.98)',
                            animation: 'fadeInUp 0.3s var(--ease-out)',
                            position: 'relative'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProject(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            <X size={18} />
                        </button>

                        {/* Modal Image Cover */}
                        <div style={{ width: '100%', height: '360px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={selectedProject.images?.[0] || '/spotifyclone.png'}
                                alt={selectedProject.title}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900';
                                }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(10, 15, 26, 1) 0%, transparent 60%)'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '24px',
                                left: '40px'
                            }}>
                                <span className="font-mono" style={{ color: 'var(--accent-hi)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {selectedProject.tag}
                                </span>
                                <h2 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
                                    {selectedProject.title}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '40px' }}>
                            {/* Project Meta Metrics */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '20px',
                                borderBottom: '1px solid var(--border)',
                                paddingBottom: '24px',
                                marginBottom: '32px'
                            }} className="modal-meta-grid">
                                <div>
                                    <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Category</span>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{selectedProject.category}</span>
                                </div>
                                <div>
                                    <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Client / Host</span>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{selectedProject.client || 'Personal Project'}</span>
                                </div>
                                <div>
                                    <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Duration</span>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{selectedProject.duration || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Status</span>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--accent-hi)' }}>{selectedProject.status || 'Completed'}</span>
                                </div>
                            </div>

                            {/* Case Study Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }} className="grid-2">
                                <div>
                                    <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '12px' }}>
                                        Project Description
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '24px', fontWeight: 300, whiteSpace: 'pre-wrap' }}>
                                        {selectedProject.description}
                                    </p>

                                    {selectedProject.features && selectedProject.features.length > 0 && (
                                        <>
                                            <h4 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Key Features</h4>
                                            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                                                {selectedProject.features.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    {selectedProject.challenges && (
                                        <>
                                            <h4 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Challenges Faced</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px', fontWeight: 300 }}>
                                                {selectedProject.challenges}
                                            </p>
                                        </>
                                    )}

                                    {selectedProject.results && (
                                        <>
                                            <h4 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Project Results</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 300 }}>
                                                {selectedProject.results}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div>
                                    {/* Links Widget */}
                                    <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                                        <h4 className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-hi)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Project Links</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {selectedProject.live && (
                                                <a
                                                    href={selectedProject.live}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn-primary"
                                                    style={{ padding: '10px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
                                                >
                                                    Live Demo <ExternalLink size={14} />
                                                </a>
                                            )}
                                            {selectedProject.code && (
                                                <a
                                                    href={selectedProject.code}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn-secondary"
                                                    style={{ padding: '10px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
                                                >
                                                    Source Code <Code size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Full Tech Stack Widget */}
                                    <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                                        <h4 className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-hi)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Tech Stack</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {selectedProject.chips.map((chip, idx) => (
                                                <span key={idx} className="font-mono" style={{
                                                    fontSize: '0.68rem',
                                                    padding: '4px 10px',
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '4px',
                                                    color: 'var(--text-muted)'
                                                }}>{chip}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Embedded CSS adjustments for mobile grids inside Landing Page */}
            <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          70%, 100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes slideInWidth {
          from { width: 0; }
          to { width: auto; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 768px) {
          .md-timeline-center { display: none !important; }
          .timeline-item { padding-left: 0 !important; }
          .timeline-node { display: none !important; }
          .grid-2-form { grid-template-columns: 1fr !important; }
          .modal-meta-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
      `}</style>
        </>
    );
};

export default LandingPage;
