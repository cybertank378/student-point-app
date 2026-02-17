"use client";

import type * as React from "react";
type IconProps = React.SVGProps<SVGSVGElement>;

export type EmployeeCardIconProps = IconProps & {
  /** Warna stroke SVG. Default: currentColor (ikut warna teks parent) */
  strokeColor?: string;
};

export const EmployeeCardIcon: React.FC<EmployeeCardIconProps> = ({
  strokeColor = "currentColor",
  className,
  ...rest
}) => {
  return (
    <svg
      width={39}
      height={39}
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <rect
        x="1"
        y="1"
        width="37"
        height="37"
        rx="6"
        stroke={strokeColor}
        strokeWidth="2"
        style={{ mixBlendMode: "plus-lighter" }}
      />
      <path
        d="M29.5717 26.2727C30.3891 26.2727 31.0393 25.7583 31.6231 25.0391C32.8181 23.5667 30.856 22.39 30.1077 21.8138C29.347 21.228 28.4976 20.8961 27.6364 20.8182M26.5455 18.6364C28.0517 18.6364 29.2728 17.4153 29.2728 15.9091C29.2728 14.4029 28.0517 13.1818 26.5455 13.1818"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.4284 26.2727C9.61096 26.2727 8.96079 25.7583 8.37702 25.0391C7.18198 23.5667 9.14407 22.39 9.8924 21.8138C10.6531 21.228 11.5025 20.8961 12.3637 20.8182M12.9092 18.6364C11.4029 18.6364 10.1819 17.4153 10.1819 15.9091C10.1819 14.4029 11.4029 13.1818 12.9092 13.1818"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.7278 23.1213C14.6131 23.8105 11.6906 25.2179 13.4706 26.979C14.3402 27.8393 15.3086 28.4545 16.5262 28.4545H23.4739C24.6915 28.4545 25.6599 27.8393 26.5294 26.979C28.3095 25.2179 25.3869 23.8105 24.2722 23.1213C21.6584 21.505 18.3417 21.505 15.7278 23.1213Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.8182 14.8182C23.8182 16.9269 22.1087 18.6364 20 18.6364C17.8913 18.6364 16.1818 16.9269 16.1818 14.8182C16.1818 12.7095 17.8913 11 20 11C22.1087 11 23.8182 12.7095 23.8182 14.8182Z"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
};

/* ====================== */
/*  COMPANY LOGO ICON     */
/* ====================== */

export type CompanyLogoIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export const CompanyLogoIcon: React.FC<CompanyLogoIconProps> = ({
  title = "PT Payment Terbaik Indonesia",
  width = 40,
  height = 44,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 331.56 362.96"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={title ? "company-logo-title" : undefined}
      width={width}
      height={height}
      fill="none"
      {...rest}
    >
      {title ? <title id="company-logo-title">{title}</title> : null}
      <g>
        <path
          d="M3.01 87.32l153.64 -82.37 0.51 30.04 -70.45 37.31c22.03,6.33 38.15,26.63 38.15,50.69 0,29.13 -23.61,52.74 -52.74,52.74 -15.86,0 -30.09,-7.01 -39.76,-18.09l-0.3 82.08 -27.59 15.21 -1.47 -167.6z"
          fill="#323884"
          stroke="#FFDB99"
          strokeWidth={5.98}
          strokeMiterlimit={2.61313}
        />
        <path
          d="M328.56 88.59l-153.64 -82.37 -0.51 30.04 70.45 37.31c-22.03,6.33 -38.15,26.63 -38.15,50.69 0,29.13 23.61,52.74 52.74,52.74 15.86,0 30.09,-7.01 39.76,-18.09l0.3 82.08 27.59 15.21 1.47 -167.6z"
          fill="#FFFA22"
          stroke="#FFDB99"
          strokeWidth={5.98}
          strokeMiterlimit={2.61313}
        />
        <path
          d="M159.34 359.47l151.93 -85.48 -25.07 -16.54 -69.28 39.45c6.47,-21.99 -2.01,-46.48 -22.32,-59.38 -24.58,-15.62 -57.17,-8.36 -72.8,16.22 -8.51,13.39 -10.23,29.15 -6.06,43.26l-69.43 -43.78 -27.63 15.12 140.66 91.14z"
          fill="#34BBF3"
          stroke="#FFDB99"
          strokeWidth={5.98}
          strokeMiterlimit={2.61313}
        />
        <polygon
          points="281.69,223.92 278.31,236.55 269.43,245.91 165.37,187.88 62.31,245.36 53.42,236 50.04,223.37 153.77,165.51 153.77,58.34 166.45,55.13 178.95,58.34 178.95,166.62"
          fill="#FA8D28"
          stroke="#FFDD9F"
          strokeWidth={5.98}
          strokeMiterlimit={2.61313}
        />
      </g>
    </svg>
  );
};


export const ArrowMenuIcon: React.FC<IconProps> = (props) => {
    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z"
                fill="#EAEAFF"
                fillOpacity={0.9}
            />
            <path
                d="M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z"
                fill="#EAEAFF"
                fillOpacity={0.4}
            />
        </svg>
    );
};