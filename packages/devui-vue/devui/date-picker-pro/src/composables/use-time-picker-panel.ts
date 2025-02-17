import { ref, onMounted, watch } from 'vue';
import type { SetupContext } from 'vue';
import { initializeTimeData } from '../../../time-picker/src/utils';
import { TimePickerItem, TimerPickerPanelProps } from '../date-picker-pro-types';

export default function useTimePickerPanel(props: TimerPickerPanelProps, ctx: SetupContext): any {
  const timeListDom = ref();
  const hourList = initializeTimeData('hour');
  const minuteList = initializeTimeData('minute');
  const secondList = initializeTimeData('second');

  onMounted(() => {
    if (props.bindData) {
      timeListDom?.value?.setOuterTime(props.bindData);
    }
  });

  watch(
    () => [props.visible, props.bindData],
    ([visible, newTimeVal], [, oldTimeVal]) => {
      if (visible || newTimeVal !== oldTimeVal) {
        timeListDom.value.setOuterTime(newTimeVal);
      } else {
        timeListDom.value.resetScrollTop();
      }
    }
  );

  const handlerTimeSelected = (date: TimePickerItem) => {
    const { activeHour, activeMinute, activeSecond } = date;
    const time = `${activeHour.value}:${activeMinute.value}:${activeSecond.value}`;
    ctx.emit('selectedTime', time);
  };

  return {
    timeListDom,
    hourList,
    minuteList,
    secondList,
    handlerTimeSelected,
  };
}
