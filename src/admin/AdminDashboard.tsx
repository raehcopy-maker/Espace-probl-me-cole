import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Report = {
  id: string;
  tracking_code: string | null;
  category: string;
  person_involved: string | null;
  description: string;
  location: string | null;
  date_occurred: string | null;
  urgent: boolean;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
};

type AdminDashboardProps = {
  onLogout: () => void;
};

const categoryLabels: Record<string, string> = {
  harcelement: "Harcèlement",
  violence: "Violence / Menace",
  enseignant: "Enseignant / Personnel",
  discrimination: "Discrimination",
  infrastructure: "Infrastructure",
  academique: "Académique",
  autre: "Autre",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboard({
  onLogout,
}: AdminDashboardProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadReports() {
    setLoading(true);
    setError("");

    const { data, error: reportsError } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (reportsError) {
      console.error("Load reports error:", reportsError);
      setLoading(false);
      setError("Impossible de charger les signalements.");
      return;
    }

    const loadedReports = (data ?? []) as Report[];

    setReports(loadedReports);

    // Keep the currently selected report synchronized
    setSelectedReport((currentSelected) => {
      if (!currentSelected) {
        return null;
      }

      return (
        loadedReports.find(
          (report) => report.id === currentSelected.id,
        ) ?? null
      );
    });

    setLoading(false);
  }

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "urgent" && report.urgent) ||
        (filter === "New" &&
          (report.status === "New" || report.status === null)) ||
        report.status === filter;

      const matchesSearch =
        !searchText ||
        report.tracking_code?.toLowerCase().includes(searchText) ||
        report.person_involved?.toLowerCase().includes(searchText) ||
        report.description.toLowerCase().includes(searchText) ||
        report.category.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [reports, filter, search]);

  const statistics = useMemo(() => {
    return {
      total: reports.length,

      new: reports.filter(
        (report) =>
          report.status === "New" || report.status === null,
      ).length,

      investigating: reports.filter(
        (report) => report.status === "Investigating",
      ).length,

      resolved: reports.filter(
        (report) => report.status === "Resolved",
      ).length,

      urgent: reports.filter(
        (report) => report.urgent,
      ).length,
    };
  }, [reports]);

  async function updateReport(
    reportId: string,
    status: string,
    adminNotes: string,
  ): Promise<void> {
    if (saving) {
      return;
    }

    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("reports")
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateError) {
      console.error("Update report error:", updateError);

      setSaving(false);
      setError(
        "Impossible d'enregistrer les modifications.",
      );

      return;
    }

    // Update the list locally
    setReports((previousReports) =>
      previousReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status,
              admin_notes: adminNotes,
            }
          : report,
      ),
    );

    // Update the selected report locally
    setSelectedReport((previousReport) =>
      previousReport?.id === reportId
        ? {
            ...previousReport,
            status,
            admin_notes: adminNotes,
          }
        : previousReport,
    );

    setSaving(false);
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    setError("");

    const { error: logoutError } =
      await supabase.auth.signOut();

    if (logoutError) {
      console.error("Logout error:", logoutError);
      setLoggingOut(false);
      setError("Impossible de se déconnecter.");
      return;
    }

    setLoggingOut(false);
    onLogout();
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-brand-icon">🛡️</div>

          <div>
            <strong>School Problem Hub</strong>
            <span>Administration</span>
          </div>
        </div>

        <button
          className="admin-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Déconnexion..." : "Déconnexion"}
        </button>
      </header>

      <section className="admin-content">
        <div className="admin-title-row">
          <div>
            <p className="admin-eyebrow">
              TABLEAU DE BORD
            </p>

            <h1>Signalements</h1>

            <p>
              Consultez, examinez et gérez les signalements reçus.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadReports}
            disabled={loading}
          >
            {loading ? "↻ Chargement..." : "↻ Actualiser"}
          </button>
        </div>

        {/* STATISTICS */}

        <div className="stats-grid">
          <div className="stat-card">
            <span>📋</span>

            <div>
              <strong>{statistics.total}</strong>
              <p>Total</p>
            </div>
          </div>

          <div className="stat-card">
            <span>🆕</span>

            <div>
              <strong>{statistics.new}</strong>
              <p>Nouveaux</p>
            </div>
          </div>

          <div className="stat-card">
            <span>🔎</span>

            <div>
              <strong>{statistics.investigating}</strong>
              <p>En cours</p>
            </div>
          </div>

          <div className="stat-card">
            <span>✓</span>

            <div>
              <strong>{statistics.resolved}</strong>
              <p>Résolus</p>
            </div>
          </div>

          <div className="stat-card urgent-stat">
            <span>🚨</span>

            <div>
              <strong>{statistics.urgent}</strong>
              <p>Urgents</p>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="admin-error dashboard-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* TOOLBAR */}

        <div className="reports-toolbar">
          <input
            type="search"
            placeholder="Rechercher un code, une personne..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            aria-label="Rechercher un signalement"
          />

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
            aria-label="Filtrer les signalements"
          >
            <option value="all">
              Tous les signalements
            </option>

            <option value="New">
              Nouveaux
            </option>

            <option value="Investigating">
              En cours
            </option>

            <option value="Resolved">
              Résolus
            </option>

            <option value="urgent">
              Urgents
            </option>
          </select>
        </div>

        {/* MAIN LAYOUT */}

        <div className="reports-layout">
          <section className="reports-list">
            <div className="reports-list-header">
              <h2>Signalements récents</h2>

              <span>{filteredReports.length}</span>
            </div>

            {loading ? (
              <div className="empty-state">
                Chargement des signalements...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="empty-state">
                Aucun signalement trouvé.
              </div>
            ) : (
              filteredReports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  className={`report-item ${
                    selectedReport?.id === report.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedReport(report)
                  }
                >
                  <div className="report-item-top">
                    <strong>
                      {report.tracking_code ??
                        "Sans code"}
                    </strong>

                    {report.urgent && (
                      <span className="urgent-badge">
                        URGENT
                      </span>
                    )}
                  </div>

                  <h3>
                    {categoryLabels[report.category] ??
                      report.category}
                  </h3>

                  <p>
                    {report.description.length > 90
                      ? `${report.description.slice(
                          0,
                          90,
                        )}...`
                      : report.description}
                  </p>

                  <small>
                    {formatDate(report.created_at)}
                  </small>
                </button>
              ))
            )}
          </section>

          {/* DETAIL VIEW */}

          <section className="report-detail">
            {!selectedReport ? (
              <div className="detail-placeholder">
                <div>📄</div>

                <h2>
                  Sélectionnez un signalement
                </h2>

                <p>
                  Les détails du signalement sélectionné
                  apparaîtront ici.
                </p>
              </div>
            ) : (
              <ReportDetail
                key={selectedReport.id}
                report={selectedReport}
                saving={saving}
                onSave={updateReport}
              />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

interface ReportDetailProps {
  report: Report;
  saving: boolean;
  onSave: (
    reportId: string,
    status: string,
    adminNotes: string,
  ) => Promise<void>;
}

function ReportDetail({
  report,
  saving,
  onSave,
}: ReportDetailProps) {
  const [status, setStatus] = useState(
    report.status ?? "New",
  );

  const [notes, setNotes] = useState(
    report.admin_notes ?? "",
  );

  async function handleSave() {
    await onSave(
      report.id,
      status,
      notes.trim(),
    );
  }

  return (
    <div>
      <div className="detail-header">
        <div>
          <p className="admin-eyebrow">
            SIGNALEMENT
          </p>

          <h2>
            {report.tracking_code ?? "Sans code"}
          </h2>
        </div>

        {report.urgent && (
          <span className="urgent-badge large">
            🚨 URGENT
          </span>
        )}
      </div>

      <div className="detail-section">
        <span className="detail-label">
          Catégorie
        </span>

        <strong>
          {categoryLabels[report.category] ??
            report.category}
        </strong>
      </div>

      <div className="detail-section">
        <span className="detail-label">
          Personne concernée
        </span>

        <strong>
          {report.person_involved ||
            "Non précisée"}
        </strong>
      </div>

      <div className="detail-section">
        <span className="detail-label">
          Description
        </span>

        <p className="description-box">
          {report.description}
        </p>
      </div>

      <div className="detail-two-columns">
        <div className="detail-section">
          <span className="detail-label">
            Lieu
          </span>

          <strong>
            {report.location ||
              "Non précisé"}
          </strong>
        </div>

        <div className="detail-section">
          <span className="detail-label">
            Date de l'événement
          </span>

          <strong>
            {report.date_occurred
              ? new Date(
                  report.date_occurred,
                ).toLocaleDateString("fr-FR")
              : "Non précisée"}
          </strong>
        </div>
      </div>

      <div className="detail-section">
        <span className="detail-label">
          Date du signalement
        </span>

        <strong>
          {formatDate(report.created_at)}
        </strong>
      </div>

      <div className="admin-controls">
        <label htmlFor="status-select">
          Statut
        </label>

        <select
          id="status-select"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          disabled={saving}
        >
          <option value="New">
            Nouveau
          </option>

          <option value="Investigating">
            En cours
          </option>

          <option value="Resolved">
            Résolu
          </option>
        </select>

        <label htmlFor="admin-notes">
          Notes privées
        </label>

        <textarea
          id="admin-notes"
          rows={5}
          placeholder="Notes visibles uniquement par les administrateurs..."
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          disabled={saving}
        />

        <button
          type="button"
          className="save-report-button"
          disabled={saving}
          onClick={handleSave}
        >
          {saving
            ? "Enregistrement..."
            : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}
