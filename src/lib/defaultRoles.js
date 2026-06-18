// Standard HVAC drafting tasks used as a template for all new projects.
// The Test Project displays these directly; other projects get a fresh copy on init.
export const TEMPLATE_DRAFT_CARDS = [
  // ── To-Do ──────────────────────────────────────────────────
  { id: 't01', group: 'To-Do',    title: 'Receive & review engineer mark-ups',         owner: '',   draftStatus: 'Not Started', priority: 'High',   category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't02', group: 'To-Do',    title: 'Set up drawing register (DRS)',               owner: '',   draftStatus: 'Not Started', priority: 'High',   category: 'Admin',     notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't03', group: 'To-Do',    title: 'Level / zone coordination drawings',          owner: '',   draftStatus: 'Not Started', priority: 'High',   category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't04', group: 'To-Do',    title: 'Duct layout — supply & return',               owner: '',   draftStatus: 'Not Started', priority: 'Medium', category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't05', group: 'To-Do',    title: 'Pipework layout — CHW / HHW',                 owner: '',   draftStatus: 'Not Started', priority: 'Medium', category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't06', group: 'To-Do',    title: 'Mechanical schematic — AHU / FCU',            owner: '',   draftStatus: 'Not Started', priority: 'Medium', category: 'Schematic', notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't07', group: 'To-Do',    title: 'Plant room layout',                           owner: '',   draftStatus: 'Not Started', priority: 'Medium', category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't08', group: 'To-Do',    title: 'Roof plan — condensers / cooling towers',     owner: '',   draftStatus: 'Not Started', priority: 'Medium', category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't09', group: 'To-Do',    title: 'Riser diagrams — duct & pipe',                owner: '',   draftStatus: 'Not Started', priority: 'Low',    category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't10', group: 'To-Do',    title: 'Builder work drawings (penetrations)',         owner: '',   draftStatus: 'Not Started', priority: 'Low',    category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't11', group: 'To-Do',    title: 'Equipment schedules',                         owner: '',   draftStatus: 'Not Started', priority: 'Low',    category: 'Drawing',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't12', group: 'To-Do',    title: 'Spool drawings — pre-fabrication',            owner: '',   draftStatus: 'Not Started', priority: 'Low',    category: 'Pre-fab',   notes: '',                      due: '', timelineStart: '', timelineEnd: '', checked: false },

  // ── Waiting for Information ────────────────────────────────
  { id: 't13', group: 'Waiting for Information', title: 'Structural clash check sign-off',          owner: '',   draftStatus: 'Waiting for Info', priority: 'High',   category: 'Drawing',   notes: 'Awaiting structural model', due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't14', group: 'Waiting for Information', title: 'Hydraulic / fire services coordination',   owner: '',   draftStatus: 'Waiting for Info', priority: 'Medium', category: 'Drawing',   notes: 'Awaiting hydraulic model',  due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't15', group: 'Waiting for Information', title: 'Equipment data sheets from supplier',      owner: '',   draftStatus: 'Waiting for Info', priority: 'Medium', category: 'Equipment', notes: '',                          due: '', timelineStart: '', timelineEnd: '', checked: false },

  // ── Completed ──────────────────────────────────────────────
  { id: 't16', group: 'Completed no further action required', title: 'Design brief review',         owner: '',   draftStatus: 'Done', priority: '',       category: 'Admin',   notes: '',  due: '', timelineStart: '', timelineEnd: '', checked: false },
  { id: 't17', group: 'Completed no further action required', title: 'Existing conditions survey',  owner: '',   draftStatus: 'Done', priority: '',       category: 'Drawing', notes: '',  due: '', timelineStart: '', timelineEnd: '', checked: false },
]

export function getDefaultRoles(projectName) {
  return {
    pm: {
      label: 'Project Management',
      owner: 'PM',
      desc: 'D&C program, procurement, programme',
      color: '#E6F1FB',
      textColor: '#0C447C',
      iconColor: '#185FA5',
      metrics: [
        { label: 'Programme',        value: '—', sub: 'Not set yet' },
        { label: 'Procurement open', value: '—', sub: 'Not set yet' },
        { label: 'Open RFIs',        value: '—', sub: 'Not set yet' },
        { label: 'Budget',           value: '—', sub: 'Not set yet' },
      ],
      progress: [
        { label: 'Design',        pct: 0, color: '#7F77DD' },
        { label: 'Procurement',   pct: 0, color: '#378ADD' },
        { label: 'Installation',  pct: 0, color: '#1D9E75' },
        { label: 'Commissioning', pct: 0, color: '#EF9F27' },
      ],
      cards: [],
    },
    eng: {
      label: 'Engineering',
      owner: 'ENG',
      desc: 'Calcs, submittals, schematics',
      color: '#EEEDFE',
      textColor: '#3C3489',
      iconColor: '#534AB7',
      metrics: [
        { label: 'Hours used',     value: '—', sub: 'Not set yet' },
        { label: 'Hrs to complete',value: '—', sub: 'Not set yet' },
        { label: 'Tech subs open', value: '—', sub: 'Not set yet' },
        { label: 'Schematics',     value: '—', sub: 'Not set yet' },
      ],
      progress: [],
      cards: [],
    },
    draft: {
      label: 'Drafting',
      owner: 'DFT',
      desc: 'DSR, IFC drawings, coordination',
      color: '#EAF3DE',
      textColor: '#27500A',
      iconColor: '#3B6D11',
      metrics: [
        { label: 'Hours used',     value: '—', sub: 'Not set yet' },
        { label: 'Hrs to complete',value: '—', sub: 'Not set yet' },
        { label: 'In coordination',value: '—', sub: 'Not set yet' },
        { label: 'DRS status',     value: '—', sub: 'Not set yet' },
      ],
      progress: [],
      // Each project gets its own copy of the template cards with fresh IDs
      cards: TEMPLATE_DRAFT_CARDS.map(c => ({
        ...c,
        id: Date.now() + Math.random(),
      })),
    },
    site: {
      label: 'Site',
      owner: 'SITE',
      desc: 'Labour, WBS, QA, ITPs',
      color: '#FAECE7',
      textColor: '#712B13',
      iconColor: '#993C1D',
      metrics: [
        { label: 'Site start',      value: '—', sub: 'Not set yet' },
        { label: 'WBS dates',       value: '—', sub: 'Not set yet' },
        { label: 'ITPs submitted',  value: '—', sub: 'Not set yet' },
        { label: 'Pre-fab status',  value: '—', sub: 'Not set yet' },
      ],
      progress: [],
      cards: [],
    },
  }
}
