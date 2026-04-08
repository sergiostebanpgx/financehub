import { ComponentType } from "react";
import {
  CategoryBusIcon,
  CategoryEntertainmentIcon,
  CategoryFoodIcon,
  CategoryHouseIcon,
  CategoryShoppingIcon,
  CategoryWalletIcon,
  IncomeIcon,
} from "@/components/ui/pretty-icons";

type CategoryIconProps = {
  className?: string;
};

const iconMap: Record<string, ComponentType<CategoryIconProps>> = {
  wallet: CategoryWalletIcon,
  utensils: CategoryFoodIcon,
  bus: CategoryBusIcon,
  house: CategoryHouseIcon,
  film: CategoryEntertainmentIcon,
  shopping: CategoryShoppingIcon,
  income: IncomeIcon,
};

export function getCategoryIcon(iconName?: string | null) {
  if (!iconName) {
    return CategoryWalletIcon;
  }

  return iconMap[iconName.toLowerCase()] ?? CategoryWalletIcon;
}
