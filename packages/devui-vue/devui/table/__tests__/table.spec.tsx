import { mount } from '@vue/test-utils';
import DTable from '../src/table';
import DColumn from '../src/components/column/column';
import { Button } from '../../button';
import { useNamespace } from '../../shared/hooks/use-namespace';
import { nextTick, ref } from 'vue';

let data: Array<Record<string, any>> = [];
const ns = useNamespace('table', true);
const noDotNs = useNamespace('table');
const flexibleOverlayNs = useNamespace('flexible-overlay', true);

describe('d-table', () => {
  beforeEach(() => {
    data = [
      {
        firstName: 'Jacob',
        lastName: 'Thornton',
        gender: 'Female',
        date: '1990/01/12',
      },
      {
        firstName: 'Mark',
        lastName: 'Otto',
        date: '1990/01/11',
        gender: 'Male',
      },
      {
        firstName: 'Danni',
        lastName: 'Chen',
        gender: 'Female',
        date: '1990/01/13',
      },
      {
        firstName: 'Green',
        lastName: 'Gerong',
        gender: 'Male',
        date: '1990/01/14',
      },
    ];
  });

  it('table render correctly', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    expect(table.exists()).toBeTruthy();
    const tableBody = table.find(ns.e('tbody'));
    expect(tableBody.findAll('tr').length).toBe(4);
    expect(tableBody.find('tr').findAll('td').length).toBe(4);
    wrapper.unmount();
  });

  it('checkable column', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="checkable"></DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const tableHeader = table.find(ns.e('thead'));
    expect(tableHeader.findAll('th')[0].classes()).toContain(noDotNs.e('checkable-cell'));
    const tableBody = table.find(ns.e('tbody'));
    expect(tableBody.find('tr').find('td').classes()).toContain(noDotNs.e('checkable-cell'));
    wrapper.unmount();
  });

  it('index column', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="index"></DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const tableHeader = table.find(ns.e('thead'));
    expect(tableHeader.findAll('th')[0].find('.title').text()).toBe('#');
    const tableBody = table.find(ns.e('tbody'));
    expect(tableBody.find('tr').find('td').text()).toBe('1');
    wrapper.unmount();
  });

  it('column default slots', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="index">{{ default: (scope) => `No.${scope.rowIndex + 1}` }}</DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const tableBody = table.find(ns.e('tbody'));
    expect(tableBody.find('tr').find('td').text()).toBe('No.1');
    wrapper.unmount();
  });

  it('column header slots', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn type="index">{{ header: () => '序号' }}</DColumn>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const tableHeader = table.find(ns.e('thead'));
    expect(tableHeader.findAll('th')[0].find('.header-container').text()).toBe('序号');
    wrapper.unmount();
  });

  it('empty template', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={[]}>
            {{
              default: () => (
                <>
                  <DColumn field="firstName" header="First Name"></DColumn>
                  <DColumn field="lastName" header="Last Name"></DColumn>
                  <DColumn field="gender" header="Gender"></DColumn>
                  <DColumn field="date" header="Date of birth"></DColumn>
                </>
              ),
              empty: () => <span id="empty-slot">No Data</span>,
            }}
          </DTable>
        );
      },
    });

    await nextTick();
    const table = wrapper.find(ns.b());
    const tableEmpty = table.find(ns.e('empty'));
    expect(tableEmpty.exists()).toBeTruthy();
    const emptySlot = tableEmpty.find('#empty-slot');
    expect(emptySlot.exists()).toBeTruthy();
    expect(emptySlot.text()).toBe('No Data');
    wrapper.unmount();
  });

  it('merge cell', async () => {
    const wrapper = mount({
      setup() {
        const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
          if (rowIndex === 0 && columnIndex === 0) {
            return { rowspan: 1, colspan: 2 };
          }
        };
        return () => (
          <DTable data={data} span-method={spanMethod}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const tableBody = table.find(ns.e('tbody'));
    const firstTd = tableBody.find('tr').find('td');
    expect(firstTd.attributes('rowspan')).toBe('1');
    expect(firstTd.attributes('colspan')).toBe('2');
    wrapper.unmount();
  });

  it('multi header', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn header="Name">
              <DColumn field="firstName" header="First Name"></DColumn>
              <DColumn field="lastName" header="Last Name"></DColumn>
            </DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const tableHeader = table.find(ns.e('thead'));
    expect(tableHeader.findAll('tr').length).toBe(2);
    expect(tableHeader.findAll('tr')[0].findAll('th').length).toBe(3);
    expect(tableHeader.findAll('tr')[1].findAll('th').length).toBe(2);
    expect(tableHeader.findAll('tr')[0].findAll('th')[0].attributes('colspan')).toBe('2');
    expect(tableHeader.findAll('tr')[0].findAll('th')[1].attributes('rowspan')).toBe('2');
    wrapper.unmount();
  });

  it('sort', async () => {
    const handleSortChange = jest.fn();
    const wrapper = mount({
      setup() {
        const sortDateMethod = (a, b) => {
          return a.date > b.date;
        };
        return () => (
          <DTable data={data} onSortChange={handleSortChange}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth" sortable sort-direction="ASC" sort-method={sortDateMethod}></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();

    const table = wrapper.find(ns.b());
    const tableHeader = table.find(ns.e('thead'));
    const lastTh = tableHeader.find('tr').findAll('th')[3];
    expect(lastTh.classes()).toContain('sort-active');

    const tableBody = table.find(ns.e('tbody'));
    const lastTd = tableBody.find('tr').findAll('td')[3];
    expect(lastTd.text()).toBe('1990/01/12');

    const sortIcon = lastTh.find(ns.e('sort-clickable'));
    await sortIcon.trigger('click');
    expect(lastTd.text()).toBe('1990/01/14');
    expect(handleSortChange).toBeCalled();

    await sortIcon.trigger('click');
    expect(lastTd.text()).toBe('1990/01/12');
    expect(handleSortChange).toBeCalled();
  });

  it('filter', async () => {
    const handleSingleChange = jest.fn();
    const wrapper = mount({
      setup() {
        const singleFilterList = [
          {
            name: 'Clear',
            value: 'Clear',
          },
          {
            name: 'Female',
            value: 'Female',
          },
          {
            name: 'Male',
            value: 'Male',
          },
        ];
        return () => (
          <DTable data={data}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn
              field="gender"
              header="Gender"
              filterable
              filter-multiple={false}
              filter-list={singleFilterList}
              onFilterChange={handleSingleChange}></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();

    const table = wrapper.find(ns.b());
    const tableHeader = table.find(ns.e('thead'));
    const filterTh = tableHeader.find('tr').findAll('th')[2];

    const filterIcon = filterTh.find('.filter-icon');
    expect(filterIcon.exists()).toBeTruthy();
    await filterIcon.trigger('click');
    const dropdownMenu = document.querySelector(flexibleOverlayNs.b());
    expect(dropdownMenu).toBeTruthy();

    const listItems = dropdownMenu?.querySelectorAll('.filter-item');
    expect(listItems?.length).toBe(3);

    await listItems[0].dispatchEvent(new Event('click'));
    expect(handleSingleChange).toBeCalled();
    expect(document.querySelector(flexibleOverlayNs.b())?.getAttribute('style')).toContain('display: none');
  });

  it('align', async () => {
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth" align="right"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const table = wrapper.find(ns.b());
    const lastTh = table.findAll('th')[3];
    expect(lastTh.classes()).toContain('is-right');
    const tableBody = wrapper.find(ns.e('tbody'));
    const lastTd = tableBody.find('tr').findAll('td')[3];
    expect(lastTd.classes()).toContain('is-right');
    wrapper.unmount();
  });

  it('cell click event', async () => {
    const onCellClick = jest.fn();
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data} onCellClick={onCellClick}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    const tableBody = wrapper.find(ns.e('tbody'));
    const lastTd = tableBody.find('tr').findAll('td')[3];
    await lastTd.trigger('click');
    expect(onCellClick).toBeCalled();
    wrapper.unmount();
  });

  it('show header api', async () => {
    const showHeader = ref(true);
    const wrapper = mount({
      setup() {
        return () => (
          <DTable data={data} show-header={showHeader.value}>
            <DColumn field="firstName" header="First Name"></DColumn>
            <DColumn field="lastName" header="Last Name"></DColumn>
            <DColumn field="gender" header="Gender"></DColumn>
            <DColumn field="date" header="Date of birth"></DColumn>
          </DTable>
        );
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.find(ns.e('thead')).exists()).toBeTruthy();

    showHeader.value = false;
    await nextTick();
    expect(wrapper.find(ns.e('thead')).exists()).toBeFalsy();
    wrapper.unmount();
  });

  it('table method test work', async () => {
    const wrapper = mount({
      setup() {
        const tableRef = ref();
        const checkedRows = ref([]);
        const getCheckedRow = () => {
          checkedRows.value = tableRef.value.store.getCheckedRows();
        };
        const toggleRowSelection = () => {
          tableRef.value.store.toggleRowSelection(data[1]);
          checkedRows.value = tableRef.value.store.getCheckedRows();
        };
        const toggleRowExpansion = () => {
          tableRef.value.store.toggleRowExpansion(data[2]);
        };
        const checkable = (row) => {
          return row.lastName.endsWith('n');
        };
        return () => (
          <div>
            <Button onClick={getCheckedRow} class="mr-m mb-m">
              Get CheckedRows
            </Button>
            <Button onClick={toggleRowSelection} class="mr-m mb-m">
              toggleRowSelection
            </Button>
            <Button onClick={toggleRowExpansion} class="mr-m mb-m">
              toggleRowExpansion
            </Button>
            <DTable ref={tableRef} data={data} row-key="firstName" expand-row-keys={['Jacob', 'Mark']}>
              <DColumn type="expand"></DColumn>
              <DColumn type="checkable" width="40" checkable={checkable} reserve-check></DColumn>
              <DColumn field="firstName" header="First Name"></DColumn>
              <DColumn field="lastName" header="Last Name"></DColumn>
              <DColumn field="gender" header="Gender"></DColumn>
              <DColumn field="date" header="Date of birth"></DColumn>
            </DTable>
            <p>{checkedRows.value.length}</p>
          </div>
        );
      },
    });

    await nextTick();

    // getCheckedRows
    const p = wrapper.find('p');
    expect(p.element.textContent).toBe('0');
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    await nextTick();
    expect(p.element.textContent).toBe('2');

    // toggleRowSelection
    await buttons[1].trigger('click');
    expect(p.element.textContent).toBe('3');
    await buttons[1].trigger('click');
    expect(p.element.textContent).toBe('2');

    // toggleRowExpansion
    let expandedList = wrapper.findAll('.expanded');
    expect(expandedList.length).toBe(2);
    await buttons[2].trigger('click');
    expandedList = wrapper.findAll('.expanded');
    expect(expandedList.length).toBe(3);
    await buttons[2].trigger('click');
    expandedList = wrapper.findAll('.expanded');
    expect(expandedList.length).toBe(2);
  });

  it('table tree test work', async () => {
    const wrapper = mount({
      setup() {
        const baseTreeTableData = [
          {
            firstName: 'Mark1',
            lastName: 'Otto',
            date: '1990/01/11',
            gender: 'Male1',
            children: [
              {
                firstName: 'Mark2',
                lastName: 'Otto',
                date: '1990/01/11',
                gender: 'Male',
              },
              {
                firstName: 'Mark3',
                lastName: 'Otto',
                date: '1990/01/11',
                gender: 'Male',
              },
            ],
          },
        ];

        return () => (
          <div>
            <DTable indent={32} data={baseTreeTableData} row-key="firstName">
              <DColumn type="index"></DColumn>
              <DColumn field="firstName" header="First Name" show-overflow-tooltip></DColumn>
              <DColumn field="lastName" header="Last Name"></DColumn>
              <DColumn field="gender" header="Gender"></DColumn>
              <DColumn field="date" header="Date of birth"></DColumn>
            </DTable>
          </div>
        );
      },
    });

    await nextTick();
    await nextTick();

    const indent = wrapper.find(ns.e('indent'));
    expect(indent.attributes('style')).toContain('padding-left: 32px;');

    const trs = wrapper.findAll('tr');
    expect(trs.length).toBe(4);

    let hiddenTrs = wrapper.findAll('.is-hidden');
    expect(hiddenTrs.length).toBe(2);

    const closeFolderIcon = wrapper.find('.icon-close-folder');
    await closeFolderIcon.trigger('click');
    await nextTick();
    hiddenTrs = wrapper.findAll('.is-hidden');
    expect(hiddenTrs.length).toBe(0);

    const openFolderIcon = wrapper.find('.icon-open-folder');
    await openFolderIcon.trigger('click');
    await nextTick();
    hiddenTrs = wrapper.findAll('.is-hidden');
    expect(hiddenTrs.length).toBe(2);
  });
});
