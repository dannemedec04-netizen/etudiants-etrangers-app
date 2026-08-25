const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M2 8.5 12 4l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6 10.7v4.3c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.3" />
      <path d="M21 8.5v6" />
    </svg>
  );
}

export function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <rect x="2.5" y="7" width="19" height="12.5" rx="2.2" />
      <path d="M8 7V5.5A2 2 0 0 1 10 3.5h4a2 2 0 0 1 2 2V7" />
      <path d="M2.5 12.5h19" />
      <path d="M10.5 12.5h3v1.8h-3z" />
    </svg>
  );
}

export function IconChecklist(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2.2" />
      <path d="M9 2.5h6a1 1 0 0 1 1 1V5H8V3.5a1 1 0 0 1 1-1Z" />
      <path d="m7.7 12 1.6 1.6L12.3 10" />
      <path d="M14.5 12h3.2" />
      <path d="m7.7 16.5 1.6 1.6 3-3.6" />
      <path d="M14.5 16.9h3.2" />
    </svg>
  );
}

export function IconAid(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M12 20.2s-7.8-4.6-9.7-9.6C1.2 7.3 3 4 6.3 4c2 0 3.5 1.2 4.3 2.6C11.3 5.2 12.9 4 14.9 4c3.3 0 5.1 3.3 4 6.6-1.9 5-9.7 9.6-9.7 9.6h.8Z" />
      <path d="M12 8.5v4.2M9.9 10.6h4.2" />
    </svg>
  );
}

export function IconChat(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M3 12.2c0-4.5 4-8.2 9-8.2s9 3.7 9 8.2-4 8.2-9 8.2c-1.1 0-2.2-.2-3.2-.5L4 21l1.2-4.3c-1.4-1.2-2.2-2.8-2.2-4.5Z" />
      <path d="M8.3 12h.01M12 12h.01M15.7 12h.01" />
    </svg>
  );
}

