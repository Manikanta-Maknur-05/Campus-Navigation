import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Anurag University, Hyderabad &bull; Official Campus Navigator
          </div>
          <h1 className="hero-title">
            Explore & Navigate <br />
            <span className="text-highlight">Anurag University</span>
          </h1>
          <p className="hero-subtitle">
            Find academic blocks, research laboratories, the central library, dining halls,
            and sports arenas across our 55+ acre Hyderabad campus with ease.
          </p>

          {/* Action Card based on Auth state */}
          <div className="hero-action-box">
            {user ? (
              <div className="hero-auth-state">
                <p className="hero-greeting">
                  Welcome back, <strong>{user.name}</strong> ({user.role === "admin" ? "Administrator" : "Student"})
                </p>
                <div className="hero-btn-row">
                  <Link to="/explore" className="btn btn-primary btn-large">
                    Open Campus Map &amp; Directions &rarr;
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="btn btn-secondary btn-large">
                      Admin Building Management
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="hero-guest-state">
                <p className="hero-guest-notice">
                  Campus navigation and building directories are accessible to authenticated students and faculty.
                </p>
                <div className="hero-btn-row">
                  <Link to="/login" className="btn btn-primary btn-large">
                    Login to Access Map
                  </Link>
                  <Link to="/register" className="btn btn-secondary btn-large">
                    Register as Student
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* University Highlights Stat Strip */}
      <section className="stats-strip">
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-number">55+</span>
            <span className="stat-label">Acres Green Campus</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Students Community</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">150+</span>
            <span className="stat-label">Cutting-Edge Labs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">6+</span>
            <span className="stat-label">Specialized Schools</span>
          </div>
        </div>
      </section>

      {/* About Anurag University Section */}
      <section className="university-about-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">University Overview</span>
            <h2 className="section-title">About Anurag University, Hyderabad</h2>
            <p className="section-description">
              A premier private university established in Telangana, driving innovation,
              academic excellence, and multidisciplinary research.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-image-wrapper">
              <img
                src="/images/anurag_engineering_block.png"
                alt="School of Engineering Building, Anurag University Hyderabad"
                className="about-image"
              />
              <div className="image-caption">
                <span>School of Engineering Building &bull; Anurag University, Hyderabad</span>
              </div>
            </div>

            <div className="about-text-content">
              <h3>A World-Class Collegiate Experience</h3>
              <p>
                Located in <strong>Venkatapur, Ghatkesar, Hyderabad (Telangana - 500088)</strong>,
                Anurag University is recognized as one of South India's top academic and research hubs.
                The university offers multidisciplinary programs spanning the <em>School of Engineering</em>,
                <em>School of Pharmacy</em>, <em>School of Management</em>, <em>School of Agricultural Sciences</em>,
                and <em>School of Nursing</em>.
              </p>
              <p>
                The sprawling 55+ acre eco-friendly campus integrates modern architectural blocks with
                shaded tree-lined walkways, manicured gardens, smart digital classrooms, advanced innovation
                incubation centres, and world-class sporting arenas.
              </p>

              <div className="features-checklist">
                <div className="check-item">
                  <span className="check-icon">&#10003;</span>
                  <div>
                    <strong>Prime Hyderabad Location</strong>
                    <p>Serene, green environment in Ghatkesar with seamless connectivity across the city.</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className="check-icon">&#10003;</span>
                  <div>
                    <strong>Multidisciplinary Excellence</strong>
                    <p>Industry-aligned curriculum with global collaborations and research publications.</p>
                  </div>
                </div>
                <div className="check-item">
                  <span className="check-icon">&#10003;</span>
                  <div>
                    <strong>Vibrant Campus Life</strong>
                    <p>Over 40+ student cultural, technical, and sports clubs fostering holistic growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Facilities & Features Section */}
      <section className="app-facilities-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">Campus Navigation Facilities</span>
            <h2 className="section-title">Smart Features Built Into Our Application</h2>
            <p className="section-description">
              Designed specifically for Anurag University students, faculty, freshers, and visitors
              to navigate the campus effortlessly.
            </p>
          </div>

          {/* Campus Facility Image Showcase */}
          <div className="facility-showcase-card">
            <div className="showcase-image-col">
              <img
                src="/images/anurag_students_campus.png"
                alt="Anurag University Students on Campus Courtyard and Academic Complex"
                className="showcase-image"
              />
            </div>
            <div className="showcase-content-col">
              <h3>Campus Infrastructure at Your Fingertips</h3>
              <p>
                From the 24/7 central library to the indoor sports complex and specialized science laboratories,
                our system catalogs every campus block with verified GPS coordinates and optimal walking paths.
              </p>
             
            </div>
          </div>

          {/* 6 Key Application Facility Cards */}
          <div className="facility-cards-grid">
            <div className="facility-card">
              <div className="facility-card-icon">&#128506;</div>
              <h4>Interactive Leaflet Map</h4>
              <p>
                Explore high-resolution campus maps with customized block pins (A, B, C, D, E, F),
                touch zoom controls, and instant popups with building information.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-card-icon">&#128269;</div>
              <h4>Instant Search &amp; Filter</h4>
              <p>
                Quickly locate any block or facility by typing its name or block letter with
                instant 300ms debounced live search.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-card-icon">&#129517;</div>
              <h4>Shortest Walking Directions</h4>
              <p>
                Get automated step-by-step directions and shortest walking paths between any two campus
                locations or from your current position on campus.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-card-icon">&#127991;</div>
              <h4>Categorized Directory</h4>
              <p>
                Filter campus landmarks into six categories: <em>Academic</em>, <em>Laboratory</em>,
                <em>Library</em>, <em>Food</em>, <em>Student Services</em>, and <em>Games</em>.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-card-icon">&#128241;</div>
              <h4>Mobile Responsive</h4>
              <p>
                Seamless mobile experience designed for students walking through campus with responsive
                touch interactions and optimized layouts.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-card-icon">&#128274;</div>
              <h4>Secure Student Portal</h4>
              <p>
                JWT-secured student accounts with verified profile management and dedicated
                administrator portals to manage campus data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Explore Anurag University?</h2>
          <p>
            Join thousands of Anurag University students and faculty finding their way effortlessly.
          </p>
          <div className="cta-buttons">
            {user ? (
              <Link to="/explore" className="btn btn-primary btn-large">
                Start Navigating Now &rarr;
              </Link>
            ) : (
              <div className="cta-btn-group">
                <Link to="/login" className="btn btn-primary btn-large">
                  Log In to Access Campus Map
                </Link>
                <Link to="/register" className="btn btn-secondary btn-large">
                  Create Student Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;