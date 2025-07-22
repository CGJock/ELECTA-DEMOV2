import React from "react";
import { useForm, Controller } from "react-hook-form";
import { AlertTriangle, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Incident } from '@/types/election';
import { volunteerEmails } from '@data/mockIncidents';

interface IncidentFormProps {
  onSubmit: (incident: Omit<Incident, "id" | "timestamp">) => void;
}

// Opciones de estado con colores
const statusOptions = [
  { value: "stuck", labelKey: "incidents.status_stuck", color: "text-red-400" },
  { value: "new", labelKey: "incidents.status_new", color: "text-blue-400" },
  { value: "resolved", labelKey: "incidents.status_resolved", color: "text-green-400" },
];

/**
 * Formulario compacto para reportar incidentes electorales.
 * Solo pide los campos útiles en un idioma.
 */
const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [loadingDepartments, setLoadingDepartments] = React.useState(true);

  React.useEffect(() => {
    fetch("/data/map/geoData.json")
      .then((res) => res.json())
      .then((geoJson) => {
        const names = geoJson.features.map((f: any) => f.properties.name);
        setDepartments(names);
        setLoadingDepartments(false);
      })
      .catch(() => setLoadingDepartments(false));
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<{
    title: string;
    description: string;
    department: string;
    zone: string;
    status: "stuck" | "new" | "resolved";
    email: string;
  }>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      department: "",
      zone: "",
      status: "new",
      email: "",
    },
  });

  const onFormSubmit = (data: any) => {
    setEmailError(null);
    if (!volunteerEmails.includes(data.email)) {
      setEmailError(t("incidents.invalid_email") || "Correo electrónico inválido: solo voluntarios pueden reportar.");
      return;
    }
    const location = {
      es: `${data.department} - ${data.zone}`.trim(),
      en: `${data.department} - ${data.zone}`.trim(),
    };
    const incident: Omit<Incident, "id" | "timestamp"> = {
      title: { es: data.title, en: data.title },
      description: { es: data.description, en: data.description },
      location,
      status: data.status,
    };
    onSubmit(incident);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full max-w-xs mx-auto p-3 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-lg border border-[#374151] shadow-lg"
      aria-label={t("incidents.form_title") || "Reportar incidente"}
    >
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
        <AlertTriangle className="text-yellow-400" size={18} />
        {t("incidents.form_title") || "Reportar incidente"}
      </h2>
      {/* Título */}
      <div className="mb-2">
        <label htmlFor="title" className="block text-xs font-medium text-gray-200 mb-1">
          {t("incidents.title") || "Título"} <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          {...register("title", { required: t("incidents.required") || "Requerido" })}
          className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${errors.title ? "border-red-400" : "border-[#374151]"}`}
          aria-invalid={!!errors.title}
          aria-required="true"
        />
        {errors.title && <span className="text-red-400 text-xs mt-1 flex items-center gap-1"><XCircle size={12} />{errors.title.message}</span>}
      </div>
      {/* Descripción */}
      <div className="mb-2">
        <label htmlFor="description" className="block text-xs font-medium text-gray-200 mb-1">
          {t("incidents.description") || "Descripción"} <span className="text-red-400">*</span>
        </label>
        <textarea
          id="description"
          {...register("description", { required: t("incidents.required") || "Requerido" })}
          className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${errors.description ? "border-red-400" : "border-[#374151]"}`}
          aria-invalid={!!errors.description}
          aria-required="true"
          rows={2}
        />
        {errors.description && <span className="text-red-400 text-xs mt-1 flex items-center gap-1"><XCircle size={12} />{errors.description.message}</span>}
      </div>
      {/* Departamento */}
      <div className="mb-2">
        <label htmlFor="department" className="block text-xs font-medium text-gray-200 mb-1">
          {t("incidents.department") || "Departamento"} <span className="text-red-400">*</span>
        </label>
        <select
          id="department"
          {...register("department", { required: t("incidents.required") || "Requerido" })}
          className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${errors.department ? "border-red-400" : "border-[#374151]"}`}
          aria-invalid={!!errors.department}
          aria-required="true"
          disabled={loadingDepartments}
        >
          <option value="">{loadingDepartments ? t("incidents.loading_departments") || "Cargando..." : t("incidents.select_department") || "Selecciona un departamento"}</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        {errors.department && <span className="text-red-400 text-xs mt-1 flex items-center gap-1"><XCircle size={12} />{errors.department.message}</span>}
      </div>
      {/* Zona/Barrio */}
      <div className="mb-2">
        <label htmlFor="zone" className="block text-xs font-medium text-gray-200 mb-1">
          {t("incidents.zone") || "Zona/Barrio"} <span className="text-red-400">*</span>
        </label>
        <input
          id="zone"
          type="text"
          {...register("zone", { required: t("incidents.required") || "Requerido" })}
          className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${errors.zone ? "border-red-400" : "border-[#374151]"}`}
          aria-invalid={!!errors.zone}
          aria-required="true"
        />
        {errors.zone && <span className="text-red-400 text-xs mt-1 flex items-center gap-1"><XCircle size={12} />{errors.zone.message}</span>}
      </div>
      {/* Correo electrónico */}
      <div className="mb-2">
        <label htmlFor="email" className="block text-xs font-medium text-gray-200 mb-1">
          {t("incidents.email") || "Correo electrónico"} <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: t("incidents.required") || "Requerido" })}
          className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${errors.email ? "border-red-400" : "border-[#374151]"}`}
          aria-invalid={!!errors.email || !!emailError}
          aria-required="true"
        />
        {(errors.email || emailError) && (
          <span className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <XCircle size={12} />
            {errors.email?.message || emailError}
          </span>
        )}
      </div>
      {/* Estado */}
      <div className="mb-3">
        <label htmlFor="status" className="block text-xs font-medium text-gray-200 mb-1">
          {t("incidents.status") || "Estado"} <span className="text-red-400">*</span>
        </label>
        <Controller
          name="status"
          control={control}
          rules={{ required: t("incidents.required") || "Requerido" }}
          render={({ field }) => (
            <select
              id="status"
              {...field}
              className={`w-full px-2 py-1 rounded bg-[#1E293B] border focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white text-sm ${errors.status ? "border-red-400" : "border-[#374151]"}`}
              aria-invalid={!!errors.status}
              aria-required="true"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className={opt.color}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          )}
        />
        {errors.status && <span className="text-red-400 text-xs mt-1 flex items-center gap-1"><XCircle size={12} />{errors.status.message}</span>}
      </div>
      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full py-1.5 rounded font-bold text-white bg-gradient-to-r from-[#10B981] to-[#2563EB] shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10B981] flex items-center justify-center gap-2 text-sm"
        disabled={!isValid || isSubmitting || loadingDepartments}
        aria-disabled={!isValid || isSubmitting || loadingDepartments}
      >
        <CheckCircle size={14} className="inline mr-1" />
        {t("incidents.submit") || "Reportar incidente"}
      </button>
    </form>
  );
};

export default IncidentForm; 