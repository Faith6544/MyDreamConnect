// src/hooks/useSortableList.js
import { supabase } from '../lib/supabase';

export function useSortableList(tableName, items, setItems) {
  
  const moveUp = async (index) => {
    if (index === 0) return;
    const newItems = [...items];
    
    // Swap in UI
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);

    // Swap in Database
    await updateOrderInDb(newItems[index - 1], index); 
    await updateOrderInDb(newItems[index], index + 1); 
  };

  const moveDown = async (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    
    // Swap in UI
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);

    // Swap in Database
    await updateOrderInDb(newItems[index + 1], index + 1); 
    await updateOrderInDb(newItems[index], index + 2);
  };

  const updateOrderInDb = async (item, newOrderIndex) => {
    await supabase
      .from(tableName)
      .update({ display_order: newOrderIndex + 1 })
      .eq('id', item.id);
  };

  return { moveUp, moveDown };
}