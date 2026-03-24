import type { AlertRecord } from "../../types/alert";
import { formatBooleanLabel, formatDateTime, formatList } from "../../utils/format";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface AlertDetailCardProps {
  alert: AlertRecord;
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
    <dd className="mt-2 whitespace-pre-wrap text-sm text-slate-900">{value || "Not provided"}</dd>
  </div>
);

export const AlertDetailCard = ({ alert }: AlertDetailCardProps) => (
  <Card className="space-y-6">
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">Alert Detail</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{alert.studentName}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Submitted {formatDateTime(alert.createdAt, alert.submittedAt)}
        </p>
      </div>
      <Badge tone={alert.severity}>{alert.severity}</Badge>
    </div>

    <dl className="grid gap-4 md:grid-cols-2">
      <DetailItem label="Faculty Name" value={alert.facultyName} />
      <DetailItem label="Faculty Email" value={alert.facultyEmail} />
      <DetailItem label="Course" value={alert.course} />
      <DetailItem label="Semester" value={alert.semester} />
      <DetailItem label="Student Name" value={alert.studentName} />
      <DetailItem label="Student ID" value={alert.studentId} />
      <DetailItem label="Student Email" value={alert.studentEmail} />
      <DetailItem label="Concern Type" value={alert.concernType} />
      <DetailItem label="Severity" value={alert.severity} />
      <DetailItem label="Addressed Student" value={formatBooleanLabel(alert.addressedStudent)} />
      <DetailItem label="Follow-up Requested" value={alert.followUpRequested} />
      <DetailItem label="Time Sensitive" value={formatBooleanLabel(alert.timeSensitive)} />
      <DetailItem label="Core Function Areas" value={formatList(alert.coreFunctionAreas)} />
      <DetailItem label="Action Taken" value={alert.actionTaken} />
      <DetailItem label="Urgency Explanation" value={alert.urgencyExplanation} />
      <DetailItem label="Description" value={alert.description} />
      <DetailItem label="Evidence" value={alert.evidence} />
      <DetailItem label="Submitter UID" value={alert.userUid} />
      <DetailItem label="Submitter Email" value={alert.userEmail} />
    </dl>
  </Card>
);
