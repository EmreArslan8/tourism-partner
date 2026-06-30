/* Common UI kit — tek giriş noktası. Sayfalar bileşenleri buradan tüketir:
   import { Card, CardHeader, Tabs, Tab, Button, Field, EmptyState } from "@/components/common"; */

export { default as Button } from "./Button";
export { default as Badge } from "./Badge";
export { default as Input } from "./Input";
export { default as SectionHeader } from "./SectionHeader";
export { default as Field } from "./Field";
export { default as EmptyState } from "./EmptyState";
export { default as StatusBadge } from "./StatusBadge";
export { default as DataTable, type Column } from "./DataTable";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardIcon,
} from "./Card";

export { Tabs, TabList, Tab, TabPanel } from "./Tabs";
export { Dialog, DialogTrigger, DialogClose, DialogContent } from "./Dialog";
export { default as ConfirmAction } from "./ConfirmAction";
