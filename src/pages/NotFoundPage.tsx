import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

export const NotFoundPage = () => (
  <PageContainer>
    <div className="space-y-6">
      <EmptyState
        title="Page not found"
        description="The page you requested is not available in this application."
      />
      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  </PageContainer>
);
