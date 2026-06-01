const MOCK_DOCUMENTS = [
  { id: 1, reg_num: '01-15/1245', subject: 'О выделении средств на капремонт кровли ул. Советская, 12', status: 'new', date: '2025-05-22', nas_path: '/nas/docs/01-15-1245.pdf' },
  { id: 2, reg_num: '01-15/1246', subject: 'Запрос документации по объекту ул. Ленина, 45', status: 'in_progress', date: '2025-05-20', nas_path: '/nas/docs/01-15-1246.pdf' },
  { id: 3, reg_num: '01-15/1247', subject: 'Уведомление о проверке целевого использования средств', status: 'overdue', date: '2025-04-28', nas_path: '/nas/docs/01-15-1247.pdf' },
  { id: 4, reg_num: '01-15/1248', subject: 'Акт выполненных работ по объекту ул. Победы, 8', status: 'new', date: '2025-05-25', nas_path: '/nas/docs/01-15-1248.pdf' },
  { id: 5, reg_num: '01-15/1249', subject: 'Согласование сметы на благоустройство территории', status: 'in_progress', date: '2025-05-18', nas_path: '/nas/docs/01-15-1249.pdf' },
  { id: 6, reg_num: '01-15/1250', subject: 'Претензия подрядчика по срокам оплаты', status: 'overdue', date: '2025-04-15', nas_path: '/nas/docs/01-15-1250.pdf' },
  { id: 7, reg_num: '01-15/1251', subject: 'Отчёт об исполнении бюджета за апрель 2025', status: 'new', date: '2025-05-26', nas_path: '/nas/docs/01-15-1251.pdf' },
];

const DEPARTMENTS = [
  { id: 'cap_repair', label: 'Капитальный ремонт' },
  { id: 'finance', label: 'Финансово-экономический' },
  { id: 'legal', label: 'Юридический' },
  { id: 'construction', label: 'Строительный контроль' },
  { id: 'admin', label: 'Административный' },
];

const DEPARTMENT_PROMPTS = {
  cap_repair: 'Отделу капитального ремонта: провести проверку и подготовить план мероприятий. Контроль до ',
  finance: 'Финансово-экономическому отделу: проверить обоснованность затрат и подготовить заключение. Срок до ',
  legal: 'Юридическому отделу: подготовить правовое заключение по прилагаемым документам. Срок до ',
  construction: 'Отделу строительного контроля: провести выездную проверку объекта и составить акт. Срок до ',
  admin: 'Административному отделу: обеспечить организационное сопровождение и контроль исполнения. Срок до ',
};

const statusMeta = {
  new: { label: 'Новое', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: { label: 'В работе', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  overdue: { label: 'Просрочено', class: 'bg-red-50 text-red-700 border-red-200' },
};

export async function fetchDocuments() {
  await new Promise(r => setTimeout(r, 400));
  return [...MOCK_DOCUMENTS];
}

export async function aiAnalyze(docId) {
  await new Promise(r => setTimeout(r, 1200));
  const doc = MOCK_DOCUMENTS.find(d => d.id === docId);
  if (!doc) throw new Error('Document not found');
  const summaries = {
    1: 'Запрос на выделение бюджетных средств для проведения капитального ремонта кровли многоквартирного дома. Необходимо срочное рассмотрение в связи с аварийным состоянием кровли.',
    2: 'Подрядчик запрашивает проектную и разрешительную документацию по объекту капитального ремонта. Требуется оперативная передача документов для соблюдения сроков строительства.',
    3: 'Контролирующий орган уведомляет о плановой проверке целевого использования средств фонда. Необходимо подготовить отчётность за текущий период.',
    4: 'Представлен акт приёмки выполненных работ по капитальному ремонту фасада подрядной организацией. Требуется проверка и подписание.',
    5: 'Запрос на согласование сметной документации для благоустройства придомовой территории. Смета подготовлена в рамках программы улучшения городской среды.',
    6: 'Поставщик услуг направил официальную претензию по нарушению сроков оплаты выполненных работ. Риск судебного разбирательства.',
    7: 'Ежемесячный отчёт об исполнении бюджета фонда за апрель. Содержит данные по статьям расходов и остаткам средств.',
  };
  const recommendedDept = ['cap_repair', 'finance', 'legal', 'construction', 'admin'][docId % 5];
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const deadline = date.toLocaleDateString('ru-RU');
  return {
    summary: summaries[docId] || 'Документ требует анализа. Запустите проверку для получения резюме.',
    recommended_department: recommendedDept,
    suggested_resolution: (DEPARTMENT_PROMPTS[recommendedDept] || DEPARTMENT_PROMPTS.cap_repair) + deadline,
  };
}

export async function approveDocument(docId, resolution, department) {
  await new Promise(r => setTimeout(r, 500));
  return { success: true, message: 'Резолюция утверждена и направлена в отдел' };
}

export { statusMeta, DEPARTMENTS };
