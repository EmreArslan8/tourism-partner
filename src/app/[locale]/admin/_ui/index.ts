export {
  PanelActionLink as AdminActionButton,
  PanelButton as AdminButton,
  PanelCard as AdminPanel,
  PanelEmptyState as AdminEmptyState,
  PanelField as AdminField,
  PanelHero as AdminHero,
  PanelMetricCard as AdminMetric,
  PanelPage as AdminPage,
  PanelPageHeader as AdminPageHeader,
  PanelSelect as AdminSelect,
  PanelTextarea as AdminTextarea,
} from "@/components/workspace-ui";

import { panelTone, panelUi, type PanelTone } from "@/components/workspace-ui";

export type AdminTone = PanelTone;
export const toneClasses = panelTone;
export const adminUi = {
  ...panelUi,
  sapphireButton: panelUi.primaryButton,
  ghostButton: panelUi.secondaryButton,
};
