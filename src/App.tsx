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
  { value: "violence", label: "Violence ou menaces" },
  {
    value: "enseignant",
    label: "Difficulté avec un membre du personnel",
  },
  { value: "discrimination", label: "Discrimination ou exclusion" },
  { value: "infrastructure", label: "Problème d'infrastructure ou matériel" },
  { value: "academique", label: "Surcharge ou problème académique" },
  { value: "autre", label: "Autre situation préoccupante" },
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
  onTrackReport,
}: {
  onScrollToReport: () => void;
  onTrackReport: () => void;
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
            <span>Écoute · Protection · Action</span>
          </div>
        </button>

        <nav className="desktop-nav">
          <a href="#accueil">Accueil</a>
          <a href="#confiance">Notre engagement</a>
          <button
  type="button"
  className="header-button"
  onClick={onTrackReport}
>
  Suivre mon signalement
</button>
          <button
            className="header-button"
            type="button"
            onClick={onScrollToReport}
          >
            Faire un signalement
          </button>
        </nav>
      </div>
    </header>
  );
}

// --- HERO & IMMEDIATE ACTION ---

function Hero({ onScrollToReport }: { onScrollToReport: () => void }) {
  return (
    <section id="accueil" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <p className="eyebrow">ESPACE DE PAROLE SÉCURISÉ</p>
          <h1>
            Tu as le droit
            <br />
            d'être en sécurité.
            <br />
            <span>Dis-nous tout.</span>
          </h1>

          <p className="hero-description">
            Subir du harcèlement, des tensions ou un problème à l'école n'est
            jamais de ta faute. Cet espace te permet de briser le silence de
            manière 100% anonyme et sécurisée.
          </p>

          <div className="hero-badges">
            <div className="security-badge">
              <span>🔒</span>
              <strong>Anonymat garanti</strong>
            </div>
            <div className="security-badge">
              <span>⚡</span>
              <strong>Pris au sérieux</strong>
            </div>
          </div>

          <button
            className="hero-cta-button"
            type="button"
            onClick={onScrollToReport}
          >
            <span>✍️</span> Rédiger mon signalement en 2 minutes →
          </button>
        </div>

        <div className="hero-image">
          <img
            src="/images/hero-students.jpg"
            alt="Élèves dans un environnement bienveillant"
          />
        </div>
      </div>
    </section>
  );
}

// --- REASSURANCE / TRUST SECTION ---

function TrustSection() {
  return (
    <section id="confiance" className="trust-section">
      <div className="section-heading">
        <p className="eyebrow">TRANSPARENCE TOTALE</p>
        <h2>
          Que se passe-t-il après
          <br />
          avoir envoyé ton message ?
        </h2>
        <p>
          Rien ne se fait en cachette. Voici exactement comment l'administration
          traite ta situation.
        </p>
      </div>

      <div className="trust-grid">
        <article className="trust-card">
          <img
            src="/images/trust-anonymous.JPG"
            alt="Sécurité et confidentialité"
          />
          <div className="trust-card-content">
            <div className="trust-icon">🔐</div>
            <h3>Zéro nom, zéro risque.</h3>
            <p>
              Aucune donnée personnelle d'identification n'est exigée. Tu reçois
              simplement un code unique pour suivre l'évolution.
            </p>
          </div>
        </article>

        <article className="trust-card">
          <img
            src="/images/trust-discussion.JPG"
            alt="Écoute attentive"
          />
          <div className="trust-card-content">
            <div className="trust-icon">🛡️</div>
            <h3>Protection contre les représailles.</h3>
            <p>
              La plateforme est conçue pour empêcher qu'un signalement ne soit
              détourné ou manipulé par quiconque au sein de l'établissement.
            </p>
          </div>
        </article>

        <article className="trust-card">
          <img
            src="/images/trust-investigation.JPG"
            alt="Examen rigoureux"
          />
          <div className="trust-card-content">
            <div className="trust-icon">🎯</div>
            <h3>Une action concrète menée.</h3>
            <p>
              Chaque signalement transmis est lu et évalué par l'équipe
              référente afin de rétablir un climat serein.
            </p>
          </div>
        </article>
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
        <p className="eyebrow">MESSAGE TRANSMIS AVEC SUCCÈS</p>
        <h1>Merci d'avoir pris la parole.</h1>

        <p className="success-description">
          Ton courage fait toute la différence. Ton message a bien été transmis
          aux équipes de l'établissement pour examen prioritaire.
        </p>

        <div className="report-number">
          <span>Ton code secret de suivi</span>
          <strong>{reportNumber}</strong>
        </div>

        <p className="small-text">
          Note bien ce code quelque part en lieu sûr. Il te permettra de
          connaître l'avancement du traitement sans révéler ton identité.
        </p>

        <button
          className="primary-button"
          type="button"
          onClick={onReset}
        >
          Effectuer un autre signalement
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
      setError("Veuillez décrire le problème rencontré.");
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
        setError("Impossible d'envoyer le message. Veuillez réessayer.");
        return;
      }

      onSuccess(trackingCode);
    } catch (submissionError) {
      console.error("REPORT SUBMISSION ERROR:", submissionError);
      setError(
        "Une erreur technique est survenue. Vérifie ta connexion.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span>✍️</span>
        <div>
          <h3>Décris ce qui se passe</h3>
          <p>Exprime-toi librement. Les champs avec * sont requis.</p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">De quel type de situation s'agit-il ? *</label>
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
          Personne(s) concernée(s) <span>Facultatif</span>
        </label>
        <input
          id="person"
          type="text"
          maxLength={120}
          placeholder="Nom ou rôle (ex: élève de 4ème, professeur...)"
          value={formData.person}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange("person", event.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Raconte-nous les faits en détail *</label>
        <textarea
          id="description"
          required
          rows={6}
          maxLength={1000}
          placeholder="Que s'est-il passé ? Quand est-ce que cela a commencé ? Sois aussi précis que possible..."
          value={formData.description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("description", event.target.value)
          }
        />
        <div className="character-count">
          {formData.description.length}/1000 caractères
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Où cela s'est-il produit ?</label>
          <input
            id="location"
            type="text"
            maxLength={150}
            placeholder="Ex: Cour de récréation, couloir, cantine..."
            value={formData.location}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleChange("location", event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date approximative</label>
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
          <strong>Situation d'urgence critique</strong>
          <small>
            Coche cette case si quelqu'un est en danger immédiat ou s'il y a
            risque de violence imminente.
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
        {loading ? "Transmission sécurisée..." : "🛡️ Transmettre mon signalement"}
      </button>

      <p className="form-footer">
        🔒 Ton identité reste strictement confidentielle. Tu n'es pas seul(e).
      </p>
    </form>
  );
}

// --- REPORT TRACKING PAGE ---
type TrackedReport = {
  tracking_code: string;
  status: string;
};
function TrackingView({
  onBack,
}: {
  onBack: () => void;
}) {
  const [code, setCode] = useState("");
  const [report, setReport] = useState<TrackedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const statusInfo: Record<
    string,
    { label: string; description: string; step: number }
  > = {
    New: {
      label: "Nouveau",
      description: "Ton signalement a été reçu et attend son examen.",
      step: 1,
    },
    Investigating: {
      label: "En cours d'examen",
      description: "L'administration a commencé à examiner ton signalement.",
      step: 2,
    },
    Resolved: {
      label: "Traité",
      description: "Le signalement a été marqué comme traité par l'administration.",
      step: 3,
    },
  };
  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReport(null);
    setError("");
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setError("Entre ton code de suivi.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: lookupError } = await supabase.rpc(
        "get_report_progress",
        { p_tracking_code: normalizedCode },
      );
      if (lookupError) {
        console.error("Tracking lookup error:", lookupError);
        setError(
          "Le suivi est momentanément indisponible. Réessaie plus tard.",
        );
        return;
      }
      const result = (data as TrackedReport[] | null)?.[0];
      if (!result) {
        setError(
          "Aucun signalement trouvé avec ce code. Vérifie les caractères et réessaie.",
        );
        return;
      }
      setReport(result);
    } catch (lookupError) {
      console.error("Tracking error:", lookupError);
      setError("Une erreur technique est survenue. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  }
  const currentStatus = report
    ? statusInfo[report.status] ?? {
        label: report.status,
        description: "Le statut de ton signalement a été mis à jour.",
        step: 1,
      }
    : null;
  return (
    <main className="success-page tracking-page">
      <section className="success-card tracking-card">
        <button
          type="button"
          className="tracking-back-button"
          onClick={onBack}
        >
          ← Retour à l'accueil
        </button>
        <div className="success-icon">🔎</div>
        <p className="eyebrow">SUIVI CONFIDENTIEL</p>
        <h1>Où en est ton signalement ?</h1>
        <p className="success-description">
          Entre le code reçu après l'envoi de ton message pour consulter
          son statut actuel.
        </p>
        <form onSubmit={handleSearch} className="tracking-form">
          <label htmlFor="tracking-code">
            Ton code de suivi
          </label>
          <input
            id="tracking-code"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Ex. SCH-A1B2C3D4"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={40}
            required
          />
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Recherche..." : "Consulter le suivi"}
          </button>
        </form>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        {report && currentStatus && (
          <div className="tracking-result" aria-live="polite">
            <div className="report-number">
              <span>Code du signalement</span>
              <strong>{report.tracking_code}</strong>
            </div>
            <h2>{currentStatus.label}</h2>
            <p>{currentStatus.description}</p>
            <div className="tracking-steps">
              {[
                { label: "Reçu", step: 1 },
                { label: "En cours d'examen", step: 2 },
                { label: "Traité", step: 3 },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`tracking-step ${
                    currentStatus.step >= item.step ? "completed" : ""
                  }`}
                >
                  <span>
                    {currentStatus.step >= item.step ? "✓" : item.step}
                  </span>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
            <p className="small-text">
              Pour protéger ta confidentialité, seuls le code et le statut
              du signalement sont affichés.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

// --- MAIN APP COMPONENT ---

export default function App() {
  const [reportNumber, setReportNumber] = useState<string | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const reportSectionRef = useRef<HTMLDivElement>(null);

  const isAdminPage = window.location.pathname.startsWith("/admin");

  const scrollToReport = () => {
    reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isAdminPage) {
    return <AdminRoute />;
  }

  if (showTracking) {
  return (
    <TrackingView
      onBack={() => setShowTracking(false)}
    />
  );
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
      <Header
  onScrollToReport={scrollToReport}
  onTrackReport={() => setShowTracking(true)}
/>

      <Hero onScrollToReport={scrollToReport} />

      {/* STICKY CTA */}
      <button
        className="sticky-cta"
        type="button"
        onClick={scrollToReport}
      >
        <span>🛡️</span>
        <strong>Besoin de signaler un problème ? C'est ici</strong>
        <span>→</span>
      </button>

      {/* REPORT FORM PLACED HIGHER FOR INSTANT UTILITY */}
      <section ref={reportSectionRef} className="report-section highlight-section">
        <div className="report-intro">
          <p className="eyebrow">PASSE À L'ACTION</p>
          <h2>Parle-nous de ce qui te pèse.</h2>
          <p>
            Remplis ce formulaire en toute confiance. Aucun nom ne t'est demandé.
            Ton message sera traité avec toute l'attention requise.
          </p>

          <div className="mini-trust-list">
            <div>
              <span>✓</span>
              <p>
                <strong>Anonyme & Sécurisé</strong>
                <br />
                Suivi par code unique.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                <strong>Écoute attentive</strong>
                <br />
                Pris en charge par l'administration.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                <strong>Zéro jugement</strong>
                <br />
                Chaque voix compte.
              </p>
            </div>
          </div>
        </div>

        <ReportForm onSuccess={handleSuccess} />
      </section>

      <TrustSection />

      <footer className="site-footer">
        <div>
          <strong>🛡️ School Problem Hub</strong>
          <span>Écoute · Protection · Action</span>
        </div>
        <p>
          Parce qu'un environnement scolaire sain est un droit pour chaque élève.
        </p>
      </footer>
    </main>
  );
}


