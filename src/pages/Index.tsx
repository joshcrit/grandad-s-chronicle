import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroCarousel } from "@/components/HeroCarousel";

const Index = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (error) throw error;
      return data;
    },
  });

  // Keep settings wiring, but stop using the generic AI-ish defaults in the hero.
  // (You can later manage these fields in Supabase if you want.)
  const submissionsOpen = settings?.submissions_open ?? true;

  return (
    <div className="min-h-screen memorial-gradient relative">
      {/* HERO */}
      <header className="hero-shell">
        <div className="hero-overlay">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="hero-split">
              <div className="hero-text">
                <div className="hero-content">
                  {/* Eyebrow: stop listing "roles" like tags. One bilingual-aware line, human tone. */}
                  <p className="hero-eyebrow-new">
                    Bishop Bill Godfrey <span aria-hidden="true">·</span> Obispo William <span aria-hidden="true">·</span> Grandpa <span aria-hidden="true">·</span> Dad
                  </p>

                  <h1 className="hero-title-new">Bill Godfrey</h1>

                  {/* One line. No "retired". No impersonality. */}
                  <p className="hero-subtitle-new">
                    Bishop of Peru &amp; Uruguay — priest, father, grandfather.
                  </p>

                  {/* One sentence max. Present tense. */}
                  <p className="hero-intro-new">
                    A place for stories and photographs — so we can remember Bill together.
                  </p>

                  <div className="hero-actions">
                    {submissionsOpen ? (
                      <>
                        <Link to="/add" className="hero-cta-primary">
                          Share a memory
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/gallery" className="hero-cta-secondary">
                          Read shared memories
                        </Link>
                      </>
                    ) : (
                      <p className="hero-intro-new hero-note">
                        Submissions are closed. Thank you for the memories shared.
                      </p>
                    )}
                  </div>

                  {/* Replace "Privacy & sharing" page link with one calm disclosure line */}
                  <p className="hero-disclosure">
                    Memories are reviewed by family before appearing on the site.
                  </p>
                </div>
              </div>
              <div className="hero-media">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline: Bishop Bill – life in brief */}
      <section className="timeline-shell" aria-label="Timeline">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="timeline-header">
            <h2 className="timeline-title">Bishop Bill – a life in brief</h2>
            <p className="timeline-subtitle">
              Harold William Godfrey — from Chesterfield to Peru and back.
            </p>
          </div>

          <div className="timeline-sections">
            {/* Early Life & Education */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">Early Life &amp; Education</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1948 (21 April)</div>
                  <div className="timeline-label">Born in Chesterfield</div>
                  <div className="timeline-note">Grew up worshipping at St John&apos;s, St Thomas&apos;, then St Mark&apos;s (Brampton)</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1950s–early 60s</div>
                  <div className="timeline-label">Schools</div>
                  <div className="timeline-note">Highfields Junior School, Newbold · Chesterfield Grammar School (Foljambe) 1959–1966 · Excelled in hockey (Derbyshire, Midlands, England Schoolboys)</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1966–1967</div>
                  <div className="timeline-label">Voluntary Service Overseas</div>
                  <div className="timeline-note">VSO, Isfahan, Persia (Iran)</div>
                </div>
              </div>
            </div>

            {/* Training & Calling to Ministry */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">Training &amp; Calling to Ministry</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">Late 1960s</div>
                  <div className="timeline-label">Scripture &amp; youth work</div>
                  <div className="timeline-note">Studied Scripture at Chesterfield Technical College · Worked with SS Augustine and Task Force · Met Judith (future wife)</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">Early 1970s</div>
                  <div className="timeline-label">King&apos;s College London</div>
                  <div className="timeline-note">Degree in Divinity · Awarded AKC &amp; Jelf Medal · Children Matthew and Rachel born</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">Early 1970s</div>
                  <div className="timeline-label">Ordination training</div>
                  <div className="timeline-note">St Augustine&apos;s College, Canterbury</div>
                </div>
              </div>
            </div>

            {/* Early Ministry in England */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">Early Ministry in England</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1972</div>
                  <div className="timeline-label">Ordained Deacon, Southwell Minster</div>
                  <div className="timeline-note">Curate, Church Warsop</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1973</div>
                  <div className="timeline-label">Ordained Priest</div>
                  <div className="timeline-note">Daughter Martha born</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1975–1986</div>
                  <div className="timeline-label">Team Vicar, St Peter &amp; St Paul, Hucknall</div>
                  <div className="timeline-note">Bishop of Southwell&apos;s Ecumenical Officer (1981–82)</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">Mid-1980s</div>
                  <div className="timeline-label">Sabbatical in South America</div>
                  <div className="timeline-note">3-month sabbatical → call to overseas mission</div>
                </div>
              </div>
            </div>

            {/* South America – Uruguay */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">South America – Uruguay</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1986</div>
                  <div className="timeline-label">Moved to Montevideo</div>
                  <div className="timeline-note">Rector &amp; Archdeacon of Montevideo</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1987</div>
                  <div className="timeline-label">Consecrated Assistant Bishop</div>
                  <div className="timeline-note">Assistant Bishop of Argentina &amp; Uruguay</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1988–1998</div>
                  <div className="timeline-label">First Bishop of the Missionary Diocese of Uruguay</div>
                  <div className="timeline-note">National church building, social outreach, work with the poor · Founded Instituto Teológico Anglicano del Uruguay (1990)</div>
                </div>
              </div>
            </div>

            {/* South America – Peru */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">South America – Peru</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1998</div>
                  <div className="timeline-label">Moved to Lima · Bishop of the Diocese of Peru</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">1998–2016</div>
                  <div className="timeline-label">Major expansion of church work</div>
                  <div className="timeline-note">Clergy grew from 4 to many · Communities from 8 to 100+ · 95% ministry in shanty towns/slums · Health, education &amp; poverty relief · Founded Seminario Diocesano Santos Agustín (2000) · Founded Comunión–Perú NGO (2005)</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">Honours &amp; roles</div>
                  <div className="timeline-label">Anglican Consultative Council · Deputy/Assistant Presiding Bishop, Southern Cone</div>
                  <div className="timeline-note">Doctor of Divinity (Nashotah House, USA) · Honorary doctorate (Florida) · Interfaith and national advisory roles in Peru</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">2013</div>
                  <div className="timeline-label">Derby Diocese Harvest Appeal – Chiclayo mission</div>
                  <div className="timeline-note">&quot;Clinic – School – Church&quot; project (St Mark&apos;s)</div>
                </div>
              </div>
            </div>

            {/* Return to the UK */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">Return to the UK</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">2016</div>
                  <div className="timeline-label">Retired from Peru · Returned to North Yorkshire</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">2016–2020</div>
                  <div className="timeline-label">Vicar of Lastingham with Appleton-Le-Moors, Rosedale &amp; Cropton</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">2020</div>
                  <div className="timeline-label">Retired from parish ministry</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">Until 2025</div>
                  <div className="timeline-label">Honorary Assistant Bishop, Diocese of Leeds</div>
                </div>
              </div>
            </div>

            {/* Final Years */}
            <div className="timeline-section">
              <h3 className="timeline-section-title">Final Years</h3>
              <div className="timeline-entries">
                <div className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-year">2026 (13 January)</div>
                  <div className="timeline-label">Died following a fall near home in North Yorkshire</div>
                  <div className="timeline-note">Survived by wife Judith, children Matthew, Rachel, Martha, and 6 grandchildren</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
