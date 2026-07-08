import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { panelTone, panelUi, type PanelTone } from "./styles";

export function PanelPage({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(panelUi.page, className)}>
      {(title || description || action) && (
        <PanelPageHeader title={title ?? ""} description={description ?? ""} action={action} />
      )}
      {children}
    </div>
  );
}

export function PanelPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className={cn("text-[34px] leading-tight", panelUi.title)}>{title}</h2>
        <p className={cn("mt-2 max-w-[760px] text-[14px] leading-6", panelUi.muted)}>{description}</p>
      </div>
      {action}
    </header>
  );
}

export function PanelCard({
  as = "section",
  title,
  description,
  icon,
  tone = "blue",
  action,
  children,
  className,
  bodyClassName,
}: {
  as?: "section" | "article" | "div" | "li";
  title?: string;
  description?: string;
  icon?: ReactNode;
  tone?: PanelTone;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const hasHeader = title || description || icon || action;
  const Component = as;
  return (
    <Component className={cn(panelUi.panel, "overflow-hidden", className)}>
      {hasHeader && (
        <div className={panelUi.panelHeader}>
          <div className="flex min-w-0 items-center gap-3">
            {icon && (
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-[8px]", panelTone[tone].soft, panelTone[tone].text)}>
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {title && <h3 className={cn("truncate text-[15px]", panelUi.title)}>{title}</h3>}
              {description && <p className={cn("mt-0.5 text-[13px]", panelUi.muted)}>{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children != null && <div className={bodyClassName}>{children}</div>}
    </Component>
  );
}

export function PanelMetricCard({
  label,
  value,
  hint,
  icon,
  tone = "blue",
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon?: ReactNode;
  tone?: PanelTone;
  className?: string;
}) {
  return (
    <article className={cn(panelUi.metric, "flex items-center gap-4", className)}>
      {icon && (
        <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-[10px]", panelTone[tone].soft, panelTone[tone].text)}>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className={cn("text-[13px]", panelUi.muted)}>{label}</p>
        <p className="mt-1 text-[28px] font-medium leading-none tracking-[0] text-ink">{value}</p>
        {hint && <p className={cn("mt-2 text-[12.5px]", panelUi.muted)}>{hint}</p>}
      </div>
    </article>
  );
}

export function PanelHero({
  eyebrow = "Bugünün özeti",
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-6", panelUi.hero, className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={panelUi.eyebrow}>{eyebrow}</p>
          <h2 className="mt-2 max-w-[760px] text-[32px] font-medium leading-tight tracking-[0] text-ink">{title}</h2>
          {description && <p className={cn("mt-2 max-w-[760px] text-[14px] leading-6", panelUi.muted)}>{description}</p>}
        </div>
        {action}
      </div>
    </section>
  );
}

export function PanelButton({
  children,
  variant = "solid",
  className,
  type,
  disabled,
}: {
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button type={type ?? "button"} disabled={disabled} className={cn(variant === "solid" ? panelUi.primaryButton : panelUi.secondaryButton, className)}>
      {children}
    </button>
  );
}

export function PanelActionLink({
  children,
  variant = "solid",
  className,
}: {
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  return <span className={cn(variant === "solid" ? panelUi.primaryButton : panelUi.secondaryButton, className)}>{children}</span>;
}

export function PanelField({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(panelUi.input, className)} />;
}

export function PanelSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(panelUi.input, className)}>
      {children}
    </select>
  );
}

export function PanelTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(panelUi.input, "min-h-[108px] py-2.5", className)} />;
}

export function PanelEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[10px] border border-dashed border-line bg-paper px-6 py-14 text-center", className)}>
      {icon && <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-[10px] bg-cream text-brand">{icon}</div>}
      {title && <p className="text-[15px] font-medium text-ink">{title}</p>}
      {description && <p className="mt-1.5 text-[13.5px] text-muted">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export {
  PanelActionLink as WorkspaceAction,
  PanelHero as WorkspaceHero,
  PanelMetricCard as WorkspaceMetric,
  PanelPage as WorkspacePage,
  PanelPageHeader as WorkspacePageHeader,
  PanelCard as WorkspacePanel,
};
