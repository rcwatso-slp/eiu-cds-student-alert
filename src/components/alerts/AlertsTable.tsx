import { Link } from "react-router-dom";
import type { AlertRecord } from "../../types/alert";
import { formatDateTime } from "../../utils/format";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface AlertsTableProps {
  alerts: AlertRecord[];
}

export const AlertsTable = ({ alerts }: AlertsTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
    <div className="hidden overflow-x-auto lg:block">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Student Name</th>
            <th className="px-6 py-4">Course</th>
            <th className="px-6 py-4">Concern Type</th>
            <th className="px-6 py-4">Severity</th>
            <th className="px-6 py-4">Faculty Name</th>
            <th className="px-6 py-4">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {alerts.map((alert) => (
            <tr key={alert.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDateTime(alert.createdAt, alert.submittedAt)}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{alert.studentName}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{alert.course}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{alert.concernType}</td>
              <td className="px-6 py-4">
                <Badge tone={alert.severity}>{alert.severity}</Badge>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{alert.facultyName}</td>
              <td className="px-6 py-4">
                <Link to={`/alert/${alert.id}`}>
                  <Button variant="secondary">View</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="grid gap-4 p-4 lg:hidden">
      {alerts.map((alert) => (
        <div key={alert.id} className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">
                {formatDateTime(alert.createdAt, alert.submittedAt)}
              </p>
              <h3 className="text-base font-semibold text-slate-900">{alert.studentName}</h3>
            </div>
            <Badge tone={alert.severity}>{alert.severity}</Badge>
          </div>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-900">Course</dt>
              <dd>{alert.course}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Concern Type</dt>
              <dd>{alert.concernType}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Faculty Name</dt>
              <dd>{alert.facultyName}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <Link to={`/alert/${alert.id}`}>
              <Button variant="secondary" fullWidth>
                View Alert Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);
