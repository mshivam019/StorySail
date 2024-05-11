import {StyleSheet, View} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import Dot from './Dot';

type Props = {
  data: Object[];
  x: SharedValue<number>;
};
function Pagination({data, x}: Props) {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => <Dot index={index} x={x} key={index} />)}
    </View>
  );
}

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});