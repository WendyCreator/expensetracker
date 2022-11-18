export default class BudgetTracker{
    constructor(querySelectorString){
      this.root = document.querySelector(querySelectorString)
      this.root.innerHTML = BudgetTracker.html()
      this.root.querySelector('.new-entry').addEventListener("click", ()=>{
        this.onBtnClick()
      })
      this.load();
    }

    static html(){
      return `
      <table class="budget-tracker">
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>--</th>
                  </tr>
              </thead>
              <tbody class="entries">
              
              </tbody>
              <tbody>
                  <tr>
                      <td colspan="5" class="control">
                          <button type="button" class="btn new-entry">New Entry</button>
                      </td>
                  </tr>
              </tbody>
              <tfoot class='table-dark'>
                  <tr>
                      <td colspan="5" class="summary">
                          <strong>Total</strong>
                          <span class="total">$0.00</span>
                      </td>
                  </tr>
              </tfoot>
          </table>
      `

    }

    static entryHTML(){
      return `
      <tr>
      <td>
          <input type="date" name="" id="" class="input input-date">
      </td>
      <td>
          <input type="text" name="" id="" class="input input-description" placeholder="Input a description">
      </td>
      <td>
          <select name="" id="" class="input input-type">
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
          </select>
      </td>
      <td>
          <input type="number" name="" id="" class="input input-amount">
      </td>
      <td>
          <button type="button" class="delete-entry btn">&times; </button>
      </td>
  </tr>
      `
    }

    load(){
      const entries = JSON.parse(localStorage.getItem('budget-key') || '[]')
      // console.log(entries)
      for (const entry of entries) {
        this.addEntry(entry)
        
      }
      this.updateSummary()

    }

    updateSummary(){
      const total = this.getEntryRows().reduce((total,row)=>{
        const amount = row.querySelector('.input-amount').value
        const isExpense = row.querySelector('.input-type').value === 'Expense'
        const modifier = isExpense? -1 : 1 ;
        return total + (amount * modifier)
      }, 0)
      const totalformatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(total)

      this.root.querySelector('.total').textContent = totalformatted
    }

    
    save(){
      const data = this.getEntryRows().map(row =>{
        return {
          date: row.querySelector('.input-date').value,
          description: row.querySelector('.input-description').value,
          type: row.querySelector('.input-type').value,
          amount: parseFloat(row.querySelector('.input-amount').value),
        }
      })
     localStorage.setItem('budget-key', JSON.stringify(data))
     this.updateSummary();
    }

    addEntry(entry = {}){
       this.root.querySelector('.entries').insertAdjacentHTML('beforeend', BudgetTracker.entryHTML())
      const row =  this.root.querySelector('.entries tr:last-of-type');
      row.querySelector('.input-date').value = entry.date || new Date().toISOString().slice(0,10)
      row.querySelector('.input-description').value = entry.description || ''
      row.querySelector('.input-type').value = entry.type || 'Income'
      row.querySelector('.input-amount').value = entry.amount || 0
      row.querySelector('.delete-entry').addEventListener('click', (e)=>{
        this.onDelete(e)
      })

      row.querySelectorAll('.input').forEach(input => {
        input.addEventListener('change', ()=>{
          this.save()
        }) 
      });
    }

    getEntryRows(){
      return [...this.root.querySelectorAll('.entries tr')]
    }

    onBtnClick(){
      this.addEntry()
    }

    onDelete(e){
     e.target.closest('tr').remove()
     this.save();
    }
}