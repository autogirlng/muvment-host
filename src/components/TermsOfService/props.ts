import { ReactNode } from "react";

export interface BulletListProps {
  items: string[];
  className?: string;
}

export interface NumberedListProps {
  items: { title?: string; content?: string; subItems?: string[] }[];
  className?: string;
}

export interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

export interface PolicyHeaderProps {
  title: string;
  imageSrc: string;
  date: string;
  bgColor?: string;
}

export interface SectionNavProps {
  sections: { id: string; label: string }[];
}

export interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export interface TermsContentContainerProps {
  children: ReactNode;
  className?: string;
}

export interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

export interface TermsSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    id?: string;
}
