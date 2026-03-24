import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AlertFilters } from "../components/alerts/AlertFilters";
import { AlertsTable } from "../components/alerts/AlertsTable";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { db } from "../firebase/config";
import type { AlertRecord, Severity } from "../types/alert";

export const AdminDashboardPage = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"All" | Severity>("All");

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const alertsQuery = query(collection(db, "alerts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(alertsQuery);
        const records = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<AlertRecord, "id">),
        }));
        setAlerts(records);
      } catch {
        setError("We could not load alerts right now. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch = alert.studentName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchesSeverity = severityFilter === "All" || alert.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [alerts, searchTerm, severityFilter]);

  return (
    <PageContainer className="space-y-6">
      <Card className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Admin Dashboard
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Submitted Alerts</h2>
          <p className="mt-2 text-sm text-slate-600">
            Review all faculty-submitted alerts, filter by severity, and open details for follow-up.
          </p>
        </div>

        <AlertFilters
          searchTerm={searchTerm}
          severityFilter={severityFilter}
          onSearchChange={setSearchTerm}
          onSeverityChange={setSeverityFilter}
        />
      </Card>

      {loading ? <LoadingSpinner label="Loading alerts..." /> : null}

      {error ? (
        <Card>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </Card>
      ) : null}

      {!loading && !error && filteredAlerts.length === 0 ? (
        <EmptyState
          title="No alerts found"
          description="There are no alerts matching the current search or filter settings."
        />
      ) : null}

      {!loading && !error && filteredAlerts.length > 0 ? <AlertsTable alerts={filteredAlerts} /> : null}
    </PageContainer>
  );
};
