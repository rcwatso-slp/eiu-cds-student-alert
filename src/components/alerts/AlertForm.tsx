import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuth";
import type { AlertFormErrors, AlertFormValues } from "../../types/alert";
import {
  CONCERN_TYPE_OPTIONS,
  CORE_FUNCTION_AREA_OPTIONS,
  DEFAULT_ALERT_FORM_VALUES,
  FOLLOW_UP_OPTIONS,
  SEVERITY_OPTIONS,
} from "../../utils/constants";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Badge } from "../ui/Badge";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildInitialValues = (facultyName: string, facultyEmail: string): AlertFormValues => ({
  ...DEFAULT_ALERT_FORM_VALUES,
  facultyName,
  facultyEmail,
});

const validateAlertForm = (values: AlertFormValues): AlertFormErrors => {
  const errors: AlertFormErrors = {};

  const requiredTextFields: Array<keyof AlertFormValues> = [
    "facultyName",
    "facultyEmail",
    "course",
    "semester",
    "studentName",
    "studentId",
    "studentEmail",
    "concernType",
    "severity",
    "description",
    "evidence",
    "addressedStudent",
    "followUpRequested",
    "timeSensitive",
  ];

  requiredTextFields.forEach((field) => {
    if (!String(values[field]).trim()) {
      errors[field] = "This field is required.";
    }
  });

  if (values.facultyEmail && !emailPattern.test(values.facultyEmail)) {
    errors.facultyEmail = "Please enter a valid faculty email address.";
  }

  if (values.studentEmail && !emailPattern.test(values.studentEmail)) {
    errors.studentEmail = "Please enter a valid student email address.";
  }

  if (values.timeSensitive === "yes" && !values.urgencyExplanation.trim()) {
    errors.urgencyExplanation = "Please explain why this alert is time sensitive.";
  }

  return errors;
};

export const AlertForm = () => {
  const { user } = useAuth();
  const facultyName = user?.displayName ?? "";
  const facultyEmail = user?.email ?? "";
  const [formValues, setFormValues] = useState<AlertFormValues>(
    buildInitialValues(facultyName, facultyEmail),
  );
  const [errors, setErrors] = useState<AlertFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setFormValues((currentValues) => ({
      ...currentValues,
      facultyName: facultyName || currentValues.facultyName,
      facultyEmail: facultyEmail || currentValues.facultyEmail,
    }));
  }, [facultyEmail, facultyName]);

  const updateField = <T extends keyof AlertFormValues>(field: T, value: AlertFormValues[T]) => {
    setFormValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [field]: value,
      };

      if (field === "timeSensitive" && value === "no") {
        nextValues.urgencyExplanation = "";
      }

      return nextValues;
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
      ...(field === "timeSensitive" ? { urgencyExplanation: "" } : {}),
    }));
    setSubmitSuccess("");
    setSubmitError("");
  };

  const toggleCoreFunctionArea = (option: string) => {
    const currentValues = formValues.coreFunctionAreas;
    const nextValues = currentValues.includes(option)
      ? currentValues.filter((item) => item !== option)
      : [...currentValues, option];

    updateField("coreFunctionAreas", nextValues);
  };

  const resetForm = () => {
    setFormValues(buildInitialValues(facultyName, facultyEmail));
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateAlertForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || !user) {
      return;
    }

    setSubmitting(true);
    setSubmitSuccess("");
    setSubmitError("");

    try {
      await addDoc(collection(db, "alerts"), {
        facultyName: formValues.facultyName.trim(),
        facultyEmail: formValues.facultyEmail.trim(),
        course: formValues.course.trim(),
        semester: formValues.semester.trim(),
        studentName: formValues.studentName.trim(),
        studentId: formValues.studentId.trim(),
        studentEmail: formValues.studentEmail.trim(),
        concernType: formValues.concernType,
        severity: formValues.severity,
        description: formValues.description.trim(),
        evidence: formValues.evidence.trim(),
        addressedStudent: formValues.addressedStudent === "yes",
        actionTaken: formValues.actionTaken.trim(),
        followUpRequested: formValues.followUpRequested,
        coreFunctionAreas: formValues.coreFunctionAreas,
        timeSensitive: formValues.timeSensitive === "yes",
        urgencyExplanation:
          formValues.timeSensitive === "yes" ? formValues.urgencyExplanation.trim() : "",
        createdAt: serverTimestamp(),
        submittedAt: new Date().toISOString(),
        userUid: user.uid,
        userEmail: user.email,
        status: "new",
      });

      setSubmitSuccess("Alert submitted successfully.");
      resetForm();
    } catch {
      setSubmitError("We could not save this alert. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Submit Student Alert</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complete this form to document a faculty concern and request follow-up when needed.
          </p>
        </div>
        <Badge tone="faculty">Faculty Submission</Badge>
      </div>

      {submitSuccess ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {submitSuccess}
        </div>
      ) : null}

      {submitError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="facultyName"
            label="Faculty Name"
            value={formValues.facultyName}
            onChange={(event) => updateField("facultyName", event.target.value)}
            error={errors.facultyName}
            required
          />
          <Input
            id="facultyEmail"
            label="Faculty Email"
            value={formValues.facultyEmail}
            onChange={(event) => updateField("facultyEmail", event.target.value)}
            error={errors.facultyEmail}
            required
            readOnly
          />
          <Input
            id="course"
            label="Course"
            value={formValues.course}
            onChange={(event) => updateField("course", event.target.value)}
            error={errors.course}
            required
          />
          <Input
            id="semester"
            label="Semester"
            value={formValues.semester}
            onChange={(event) => updateField("semester", event.target.value)}
            error={errors.semester}
            required
          />
          <Input
            id="studentName"
            label="Student Name"
            value={formValues.studentName}
            onChange={(event) => updateField("studentName", event.target.value)}
            error={errors.studentName}
            required
          />
          <Input
            id="studentId"
            label="Student ID"
            value={formValues.studentId}
            onChange={(event) => updateField("studentId", event.target.value)}
            error={errors.studentId}
            required
          />
          <Input
            id="studentEmail"
            label="Student Email"
            type="email"
            value={formValues.studentEmail}
            onChange={(event) => updateField("studentEmail", event.target.value)}
            error={errors.studentEmail}
            required
          />
          <Select
            id="concernType"
            label="Concern Type"
            value={formValues.concernType}
            onChange={(event) => updateField("concernType", event.target.value)}
            error={errors.concernType}
            required
          >
            <option value="">Select concern type</option>
            {CONCERN_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select
            id="severity"
            label="Severity"
            value={formValues.severity}
            onChange={(event) => updateField("severity", event.target.value as AlertFormValues["severity"])}
            error={errors.severity}
            required
          >
            <option value="">Select severity</option>
            {SEVERITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select
            id="addressedStudent"
            label="Addressed Student"
            value={formValues.addressedStudent}
            onChange={(event) =>
              updateField("addressedStudent", event.target.value as AlertFormValues["addressedStudent"])
            }
            error={errors.addressedStudent}
            required
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
          <Select
            id="followUpRequested"
            label="Follow-up Requested"
            value={formValues.followUpRequested}
            onChange={(event) => updateField("followUpRequested", event.target.value)}
            error={errors.followUpRequested}
            required
          >
            <option value="">Select follow-up</option>
            {FOLLOW_UP_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select
            id="timeSensitive"
            label="Time Sensitive"
            value={formValues.timeSensitive}
            onChange={(event) =>
              updateField("timeSensitive", event.target.value as AlertFormValues["timeSensitive"])
            }
            error={errors.timeSensitive}
            required
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </div>

        <Textarea
          id="description"
          label="Description"
          value={formValues.description}
          onChange={(event) => updateField("description", event.target.value)}
          error={errors.description}
          required
        />

        <Textarea
          id="evidence"
          label="Evidence"
          value={formValues.evidence}
          onChange={(event) => updateField("evidence", event.target.value)}
          error={errors.evidence}
          required
        />

        <Textarea
          id="actionTaken"
          label="Action Taken"
          value={formValues.actionTaken}
          onChange={(event) => updateField("actionTaken", event.target.value)}
          error={errors.actionTaken}
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Core Function Area</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_FUNCTION_AREA_OPTIONS.map((option) => {
              const checked = formValues.coreFunctionAreas.includes(option);

              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    checked
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    checked={checked}
                    onChange={() => toggleCoreFunctionArea(option)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>

        {formValues.timeSensitive === "yes" ? (
          <Textarea
            id="urgencyExplanation"
            label="Urgency Explanation"
            value={formValues.urgencyExplanation}
            onChange={(event) => updateField("urgencyExplanation", event.target.value)}
            error={errors.urgencyExplanation}
            required
          />
        ) : null}

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={resetForm} disabled={submitting}>
            Reset Form
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Alert"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
