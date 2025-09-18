// =============================
// components/lucideMap.ts (map icon string -> component)
// =============================
import * as L from "lucide-react";
export function getLucide(name?: string) {
	if (!name) return L.Lightbulb;
	return (L as any)[name] || L.Lightbulb;
}
