import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Expense, SummaryData } from '../types';
import { formatCurrency, formatDate } from './formatters';

/**
 * Export a list of expenses as a formatted PDF report.
 */
export const exportExpensesPDF = (expenses: Expense[], summary?: SummaryData): void => {
  const doc = new jsPDF({ orientation: 'landscape' });

  // ─── Header ────────────────────────────────────────────────
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Expense Tracker Report', 14, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);

  let startY = 45;

  // ─── Summary Section ────────────────────────────────────────
  if (summary) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, startY);
    startY += 8;

    autoTable(doc, {
      startY,
      head: [['Total Income', 'Total Expenses', 'Net Balance']],
      body: [
        [
          formatCurrency(summary.totalIncome),
          formatCurrency(summary.totalExpense),
          formatCurrency(summary.balance),
        ],
      ],
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] },
      bodyStyles: { fontSize: 11 },
      margin: { left: 14 },
    });

    startY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable!.finalY + 12;
  }

  // ─── Transactions Table ──────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Transactions', 14, startY);
  startY += 6;

  autoTable(doc, {
    startY,
    head: [['Date', 'Title', 'Category', 'Type', 'Amount', 'Description']],
    body: expenses.map((e) => [
      formatDate(e.date),
      e.title,
      e.category,
      e.type.charAt(0).toUpperCase() + e.type.slice(1),
      formatCurrency(e.amount),
      e.description || '—',
    ]),
    headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      4: { halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`expense-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};
