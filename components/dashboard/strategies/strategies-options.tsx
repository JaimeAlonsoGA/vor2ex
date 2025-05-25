import { Calculator, Cuboid, Cylinder, DraftingCompass, FunctionSquare, PercentCircle, Pyramid, Ruler, Settings2, Sigma } from "lucide-react";

export const ICON_OPTIONS = [
    { label: "Sigma", value: "Sigma", icon: <Sigma className="w-5 h-5" /> },
    { label: "Calculator", value: "Calculator", icon: <Calculator className="w-5 h-5" /> },
    { label: "Function", value: "FunctionSquare", icon: <FunctionSquare className="w-5 h-5" /> },
    { label: "Ruler", value: "Ruler", icon: <Ruler className="w-5 h-5" /> },
    { label: "Percent", value: "PercentCircle", icon: <PercentCircle className="w-5 h-5" /> },
    { label: "Settings", value: "Settings2", icon: <Settings2 className="w-5 h-5" /> },
    { label: "Drafting Compass", value: "DraftingCompass", icon: <DraftingCompass className="w-5 h-5" /> },
    { label: "Cube", value: "cuboid", icon: <Cuboid className="w-5 h-5" /> },
    { label: "Cylinder", value: "cylinder", icon: <Cylinder className="w-5 h-5" /> },
    { label: "Pyramid", value: "pyramid", icon: <Pyramid className="w-5 h-5" /> },
];

export const COLOR_OPTIONS = [
    { name: "Blue", value: "blue-500", class: "bg-blue-500", border: "border-blue-500" },
    { name: "Gray", value: "gray-500", class: "bg-gray-500", border: "border-gray-500" },
    { name: "Red", value: "red-500", class: "bg-red-500", border: "border-red-500" },
    { name: "Purple", value: "purple-500", class: "bg-purple-500", border: "border-purple-500" },
    { name: "Green", value: "green-500", class: "bg-green-500", border: "border-green-500" },
    { name: "Yellow", value: "yellow-500", class: "bg-yellow-500", border: "border-yellow-500" },
    { name: "Pink", value: "pink-500", class: "bg-pink-500", border: "border-pink-500" },
    { name: "Orange", value: "orange-500", class: "bg-orange-500", border: "border-orange-500" },
    { name: "Teal", value: "teal-500", class: "bg-teal-500", border: "border-teal-500" },
    { name: "Indigo", value: "indigo-500", class: "bg-indigo-500", border: "border-indigo-500" },
    { name: "Lime", value: "lime-500", class: "bg-lime-500", border: "border-lime-500" },
];
