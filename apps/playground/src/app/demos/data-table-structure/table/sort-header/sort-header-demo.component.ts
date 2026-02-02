import { Component, signal } from "@angular/core";
import { TngCol, TngTable, TngCellDef, 
  TngHeaderDef, TngSort, TngSortHeaderDirective, TngSortIcon } from "@tociva/tailng-ui/data-table-structure";

type Txn = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
};

@Component({
  selector: 'playground-sort-header-demo',
  standalone: true,
  imports: [
    TngTable,
    TngCol,
    TngCellDef,
    TngHeaderDef,
    // directive + icon
    TngSortHeaderDirective,
    TngSortIcon,
  ],
  templateUrl: './sort-header-demo.component.html',
})
export class SortHeaderDemoComponent {
  private readonly seed: Txn[] = [
    { id: 'TXN-1001', date: '2026-01-08', description: 'UPI • Amazon Pay', amount: -1299, status: 'Success' },
    { id: 'TXN-1002', date: '2026-01-08', description: 'NEFT • Salary Credit', amount: 65000, status: 'Success' },
    { id: 'TXN-1003', date: '2026-01-09', description: 'Card • Fuel', amount: -1200.5, status: 'Pending' },
    { id: 'TXN-1004', date: '2026-01-09', description: 'IMPS • Rent', amount: -15000, status: 'Failed' },
  ];

  readonly rows = signal<Txn[]>([...this.seed]);

  readonly sort = signal<TngSort>({ active: '', direction: '' });

  // bind function references (no arrow functions in template)
  readonly dateValue = (r: Txn) => r.date;
  readonly descValue = (r: Txn) => r.description;
  readonly amountValue = (r: Txn) => r.amount;
  readonly statusValue = (r: Txn) => r.status;

  onSortChange(s: TngSort) {
    this.sort.set(s);
    // demo: hook server-side sorting here if needed
  }

  // ---- actions ----
  addRow(): void {
    const next = this.makeRandomTxn();
    this.rows.set([next, ...this.rows()]);
  }

  removeFirst(): void {
    const curr = this.rows();
    if (!curr.length) return;
    this.rows.set(curr.slice(1));
  }

  removeLast(): void {
    const curr = this.rows();
    if (!curr.length) return;
    this.rows.set(curr.slice(0, -1));
  }

  removeById(id: string): void {
    const curr = this.rows();
    this.rows.set(curr.filter((r) => r.id !== id));
  }

  clear(): void {
    this.rows.set([]);
  }

  reset(): void {
    this.rows.set([...this.seed]);
  }

  badgeClass(status: unknown): string {
    switch (String(status)) {
      case 'Success':
        return 'bg-success text-white';
      case 'Pending':
        return 'bg-warning text-black';
      case 'Failed':
        return 'bg-danger text-white';
      default:
        return 'bg-info text-white';
    }
  }

  private makeRandomTxn(): Txn {
    const idNum = 1000 + this.rows().length + 1 + Math.floor(Math.random() * 50);
    const statuses: Txn['status'][] = ['Success', 'Pending', 'Failed'];
    const descs = ['UPI • Grocery', 'Card • Fuel', 'IMPS • Transfer', 'NEFT • Credit', 'UPI • Recharge'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const description = descs[Math.floor(Math.random() * descs.length)];
    const amount = (Math.random() > 0.5 ? 1 : -1) * Math.round((200 + Math.random() * 5000) * 100) / 100;

    return {
      id: `TXN-${idNum}`,
      date: new Date().toISOString().slice(0, 10),
      description,
      amount,
      status,
    };
  }
}
