import { ReactNode } from "react";

export interface benefitProps  {
    title: string;
    description: string;
    icon: ReactNode;
};

export interface FooterNavProps  {
    title: string;
    links: { name: string; link?: string; badgeTitle?: string }[];
};

export interface featureProps  {
    title: string;
    description: string;
};

export interface stepProps  {
  title: string;
  description: string;
};

export interface optionProps  {
    type: string;
    image: string;
};

export interface packageProps  {
    title: string;
    description: string;
};

export interface SectionHeaderProps  {
    title: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    children?: ReactNode;
};