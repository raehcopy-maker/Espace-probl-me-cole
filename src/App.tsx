
import { useState, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import AdminRoute from "./admin/AdminRoute";
import { supabase } from "./lib/supabase";
import "./admin/admin.css";

// --- TYPES & CONSTANTS ---

type Category =
  | "harcelement"
  | "violence"
  | "enseignant"
  | "discrimination"
  | "infrastructure"
  | "academique"
  | "autre";

interface FormData {
  category: Category;
  person: string;
  description: string;
  location: string;
  date: string;
  urgent: boolean;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "harcelement", label: "Harcèlement entre élèves" },
  { value: "violence", label: "Violence / Menace" },
  {
    value: "enseignant",
    label: "Problème avec un enseignant / membre du personnel",
  },
  { value: "discrimination", label: "Discrimination" },
  { value: "infrastructure", label: "Problème d'infrastructure" },
  { value: "academique", label: "Problème académique" },
  { value: "autre", label: "Autre" },
];

const INITIAL_FORM_DATA: FormData = {
  category: "harcelement",
  person: "",
  description: "",
  location: "",
  date: "",
  urgent: false,
};

// --- HEADER ---

function Header({
  onScrollToReport,
}: {
  onScrollToReport: () => void;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="brand"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="brand-icon">🛡️</div>
          <div>
            <strong>School Problem Hub</strong>
            <span>Écouter · Protéger · Agir.</span>
          </div>
        </button>

        <nav className="desktop-nav">
          <a href="#accueil">Accueil</a>
          <a href="#confiance">À propos</a>
          <a href="#fonctionnement">Comment ça marche</a>
          <button
            className="header-button"
            type="button"
            onClick={onScrollToReport}
          >
            Signaler un problème
          </button>
        </nav>
      </div>
    </header>
  );
}

// --- HERO ---

function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <p className="eyebrow">TA VOIX COMPTE</p>
          <h1>
            Un problème
            <br />
            à l'école ?
            <br />
            <span>Parlez-en.</span>
          </h1>

          <p className="hero-description">
            Signalez ce qui se passe de manière confidentielle et permettez à
            l'administration d'agir.
          </p>

          <div className="security-badge">
            <span>🔒</span>
            <strong>Confidentiel</strong>
            <span>·</span>
            <strong>Sécurisé</strong>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/images/hero-students.jpg"
            alt="Élèves dans une école"
          />
        </div>
      </div>
    </section>
  );
}

// --- TRUST SECTION ---

function TrustSection() {
  return (
    <section id="confiance" className="trust-section">
      <div className="section-heading">
        <p className="eyebrow">VOTRE CONFIANCE D'ABORD</p>
        <h2>
          Avant de commencer,
          <br />
          voici comment ça fonctionne.
        </h2>
        <p>
          Vous devez savoir ce qui arrive à votre signalement avant de l'envoyer.
        </p>
      </div>

      <div className="trust-grid">
        <article className="trust-card">
          <img
            src="/images/trust-discussion.JPG"
            alt="Élève discutant avec un adulte"
          />
          <div className="trust-card-content">
            <div className="trust-icon">👥</div>
            <h3>Vous n'avez pas à avoir peur de parler.</h3>
            <p>
              Votre signalement est destiné à être examiné dans un cadre
              administratif approprié.
            </p>
          </div>
        </article>

        <article className="trust-card">
          <img
            src="/images/trust-anonymous.JPG"
            alt="Élève utilisant son téléphone"
          />
          <div className="trust-card-content">
            <div className="trust-icon">🔐</div>
            <h3>Aucun nom de déclarant n'est demandé.</h3>
            <p>
              Ce formulaire ne demande pas votre nom. Votre signalement est
              enregistré sous un code.
            </p>
          </div>
        </article>

        <article className="trust-card">
          <img
            src="/images/trust-investigation.JPG"
            alt="Membres du personnel examinant un dossier"
          />
          <div className="trust-card-content">
            <div className="trust-icon">🔎</div>
            <h3>Chaque signalement est examiné.</h3>
            <p>
              Chaque signalement reçu doit être examiné afin de déterminer
              les mesures appropriées.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

// --- HOW IT WORKS ---

function HowItWorksSection() {
  return (
    <section id="fonctionnement" className="how-section">
      <div className="how-image">
        <img
          src="/images/simple-students.JPG"
          alt="Élèves dans la cour de l'école"
        />
      </div>

      <div className="how-content">
        <p className="eyebrow">C'EST SIMPLE</p>
        <h2>
          En quelques minutes,
          <br />
          vous pouvez faire la différence.
        </h2>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div>
              <h3>Décrivez le problème</h3>
              <p>
                Expliquez ce qui s'est passé avec le plus de détails possible.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div>
              <h3>Envoyez le signalement</h3>
              <p>Votre signalement est transmis de manière sécurisée.</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div>
              <h3>Nous nous en occupons</h3>
              <p>L'administration examine le signalement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- FINAL MESSAGE ---

function FinalMessageSection() {
  return (
    <section className="final-message">
      <img
        src="/images/final-student.JPG"
        alt="Élève regardant vers l'avenir"
      />
      <div>
        <p className="eyebrow">ENSEMBLE</p>
        <h2>
          Pour une école
          <br />
          plus sûre et plus juste.
        </h2>
        <p>
          Tu n'es pas seul.
          <br />
          Parler, c'est déjà agir.
        </p>
      </div>
    </section>
  );
}

// --- SUCCESS VIEW ---

function SuccessView({
  reportNumber,
  onReset,
}: {
  reportNumber: string;
  onReset: () => void;
}) {
  return (
    <main className="success-page">
      <section className="success-card">
        <div className="success-icon">✓</div>
        <p className="eyebrow">SIGNALEMENT REÇU</p>
        <h1>Votre signalement a été envoyé.</h1>

        <p className="success-description">
          Merci d'avoir pris le temps de parler. Votre signalement a été transmis
          pour examen.
        </p>

        <div className="report-number">
          <span>Votre code de signalement</span>
          <strong>{reportNumber}</strong>
        </div>

        <p className="small-text">
          Conservez ce code. Il pourra vous être utile pour retrouver votre
          signalement plus tard.
        </p>

        <button
          className="primary-button"
          type="button"
          onClick={onReset}
        >
          Faire un autre signalement
        </button>
      </section>
    </main>
  );
}

// --- REPORT FORM ---

function ReportForm({
  onSuccess,
}: {
  onSuccess: (trackingCode: string) => void;
}) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.description.trim()) {
      setError("Veuillez décrire le problème.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const trackingCode = `SCH-${crypto.randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`;

      const { error: supabaseError } = await supabase
        .from("reports")
        .insert({
          tracking_code: trackingCode,
          category: formData.category,
          person_involved: formData.person.trim() || null,
          description: formData.description.trim(),
          location: formData.location.trim() || null,
          date_occurred: formData.date || null,
          urgent: formData.urgent,
        });

      if (supabaseError) {
        console.error("SUPABASE ERROR:", supabaseError);
        setError(`Erreur : ${supabaseError.message}`);
        return;
      }

      onSuccess(trackingCode);
    } catch (submissionError) {
      console.error("REPORT SUBMISSION ERROR:", submissionError);
      setError(
        "Une erreur inattendue est survenue. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span>🛡️</span>
        <div>
          <h3>Votre signalement</h3>
          <p>Les champs marqués * sont obligatoires.</p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Catégorie du problème *</label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(event) =>
            handleChange("category", event.target.value as Category)
          }
        >
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="person">
          Personne concernée <span>Facultatif</span>
        </label>
        <input
          id="person"
          type="text"
          maxLength={120}
          placeholder="Nom de la personne concernée"
          value={formData.person}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange("person", event.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Que s'est-il passé ? *</label>
        <textarea
          id="description"
          required
          rows={6}
          maxLength={1000}
          placeholder="Décrivez le problème aussi clairement que possible..."
          value={formData.description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("description", event.target.value)
          }
        />
        <div className="character-count">
          {formData.description.length}/1000
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Où cela s'est-il passé ?</label>
          <input
            id="location"
            type="text"
            maxLength={150}
            placeholder="Salle, cour, couloir..."
            value={formData.location}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleChange("location", event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Quand cela s'est-il passé ?</label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleChange("date", event.target.value)
            }
          />
        </div>
      </div>

      <label className="urgent-option">
        <input
          type="checkbox"
          checked={formData.urgent}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange("urgent", event.target.checked)
          }
        />
        <span>
          <strong>Ce problème est urgent</strong>
          <small>
            Cochez cette case si quelqu'un est actuellement en danger ou si une
            intervention rapide est nécessaire.
          </small>
        </span>
      </label>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="submit-button"
        disabled={loading}
      >
        {loading ? "Envoi en cours..." : "🛡️ Envoyer le signalement"}
      </button>

      <p className="form-footer">
        🔒 Aucun nom de déclarant n'est demandé dans ce formulaire.
      </p>
    </form>
  );
}

// --- MAIN APP COMPONENT ---

export default function App() {
  const [reportNumber, setReportNumber] = useState<string | null>(null);
  const reportSectionRef = useRef<HTMLDivElement>(null);

  const isAdminPage = window.location.pathname.startsWith("/admin");

  const scrollToReport = () => {
    reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Render the admin area at /admin.
  if (isAdminPage) {
    return <AdminRoute />;
  }

  const handleSuccess = (trackingCode: string) => {
    setReportNumber(trackingCode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setReportNumber(null);
    requestAnimationFrame(() => scrollToReport());
  };

  if (reportNumber) {
    return (
      <SuccessView
        reportNumber={reportNumber}
        onReset={handleReset}
      />
    );
  }

  return (
    <main>
      <Header onScrollToReport={scrollToReport} />

      <Hero />

      <button
        className="sticky-cta"
        type="button"
        onClick={scrollToReport}
      >
        <span>🛡️</span>
        <strong>Signaler un problème</strong>
        <span>→</span>
      </button>

      <TrustSection />

      <HowItWorksSection />

      <FinalMessageSection />

      <section ref={reportSectionRef} className="report-section">
        <div className="report-intro">
          <p className="eyebrow">VOTRE SIGNALEMENT</p>
          <h2>Parlez-nous de ce qui s'est passé.</h2>
          <p>
            Remplissez le formulaire ci-dessous. Vous n'avez pas besoin
            d'indiquer votre nom.
          </p>

          <div className="mini-trust-list">
            <div>
              <span>✓</span>
              <p>
                <strong>Confidentiel</strong>
                <br />
                Votre signalement reçoit un code.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                <strong>Examiné</strong>
                <br />
                Chaque signalement reçu est examiné.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                <strong>Votre voix compte</strong>
                <br />
                Parlez de ce qui vous préoccupe.
              </p>
            </div>
          </div>
        </div>

        <ReportForm onSuccess={handleSuccess} />
      </section>

      <footer className="site-footer">
        <div>
          <strong>🛡️ School Problem Hub</strong>
          <span>Écouter · Protéger · Agir.</span>
        </div>
        <p>
          Une plateforme pour aider les élèves à faire entendre leur voix.
        </p>
      </footer>
    </main>
  );
}

