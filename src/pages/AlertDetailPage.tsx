import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertDetailCard } from "../components/alerts/AlertDetailCard";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { db } from "../firebase/config";
import type { AlertRecord } from "../types/alert";

export const AlertDetailPage = () => {
  const { id } = useParams();
  const [alert, setAlert] = useState<AlertRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadAlert = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const alertReference = doc(db, "alerts", id);
        const snapshot = await getDoc(alertReference);

        if (!snapshot.exists()) {
          setNotFound(true);
          return;
        }

        setAlert({
          id: snapshot.id,
          ...(snapshot.data() as Omit<AlertRecord, "id">),
        });
      } catch {
        setError("We could not load this alert. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadAlert();
  }, [id]);

  return (
    <PageContainer className="space-y-6">
      <Link to="/admin">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>

      {loading ? <LoadingSpinner label="Loading alert details..." /> : null}

      {!loading && error ? (
        <Card>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </Card>
      ) : null}

      {!loading && notFound ? (
        <EmptyState
          title="Alert not found"
          description="This alert could not be found. It may have been removed or the link may be incorrect."
        />
      ) : null}

      {!loading && !error && alert ? <AlertDetailCard alert={alert} /> : null}
    </PageContainer>
  );
};
