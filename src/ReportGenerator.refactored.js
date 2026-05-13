export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const processedItems = this.filterAndProcessItems(user, items);
    const total = this.calculateTotal(processedItems);

    if (reportType === 'CSV') {
      return this.generateCSV(user, processedItems, total).trim();
    } 
    
    if (reportType === 'HTML') {
      return this.generateHTML(user, processedItems, total).trim();
    }

    return '';
  }

  // Extração 1: Isola a regra de negócio e filtragem por tipo de usuário
  filterAndProcessItems(user, items) {
    if (user.role === 'ADMIN') {
      for (const item of items) {
        if (item.value > 1000) {
          item.priority = true;
        }
      }
      return items;
    }

    if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }

    return [];
  }

  // Extração 2: Isola a lógica matemática
  calculateTotal(items) {
    let total = 0;
    for (const item of items) {
      total += item.value;
    }
    return total;
  }

  // Extração 3: Isola a montagem específica do CSV
  generateCSV(user, items, total) {
    let report = 'ID,NOME,VALOR,USUARIO\n';
    for (const item of items) {
      report += `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    report += '\nTotal,,\n';
    report += `${total},,\n`;
    return report;
  }

  // Extração 4: Isola a montagem específica do HTML
  generateHTML(user, items, total) {
    let report = '<html><body>\n';
    report += '<h1>Relatório</h1>\n';
    report += `<h2>Usuário: ${user.name}</h2>\n`;
    report += '<table>\n';
    report += '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';

    for (const item of items) {
      const style = item.priority ? ' style="font-weight:bold;"' : '';
      report += `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }

    report += '</table>\n';
    report += `<h3>Total: ${total}</h3>\n`;
    report += '</body></html>\n';
    return report;
  }
}