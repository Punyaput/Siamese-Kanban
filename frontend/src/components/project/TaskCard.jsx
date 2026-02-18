// import React from 'react';
// import { Draggable } from '@hello-pangea/dnd';

// // รับ onClick เพิ่มเข้ามา
// export default function TaskCard({ task, index, onDelete, onClick }) { 
//   return (
//     <Draggable draggableId={task._id} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           // แปะ onClick ตรงนี้แทน (เพื่อให้คลิกเปิด Modal ได้)
//           onClick={onClick}
//           style={{
//             ...styles.card,
//             ...provided.draggableProps.style
//           }}
//         >
//           <div 
//             style={styles.deleteBtn} 
//             onClick={(e) => {
//               e.stopPropagation(); // กันไม่ให้กดปุ่มลบแล้วเด้งเปิด Modal
//               if(window.confirm('ลบงานนี้?')) onDelete(task._id);
//             }}
//           >
            
//           </div>

//           {task.imageUrl && (
//             <img src={task.imageUrl} alt="Task" style={styles.image} />
//           )}
//           <div style={styles.content}>{task.title}</div>
//         </div>
//       )}
//     </Draggable>
//   );
// }

// const styles = {
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: '8px',
//     padding: '10px',
//     marginBottom: '10px',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
//     position: 'relative',
//     userSelect: 'none'
//   },
//   deleteBtn: {
//     position: 'absolute',
//     top: '5px',
//     right: '8px',
//     cursor: 'pointer',
//     color: '#ccc',
//     fontWeight: 'bold',
//     fontSize: '16px',
//     zIndex: 10,
//   },
//   image: { width: '100%', borderRadius: '4px', marginBottom: '5px' },
//   content: { fontSize: '14px', color: '#333', wordWrap: 'break-word' }
// };

import React from 'react';

export default function TaskCard({ task }) {
  // ไฟล์นี้ต้อง "ไม่มี" Draggable, Droppable หรือปุ่ม Delete ใดๆ
  return (
    <div style={styles.card}>
      {task.imageUrl && (
        <img src={task.imageUrl} alt="Task" style={styles.image} />
      )}
      <div style={styles.content}>
        {task.title}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    cursor: 'pointer', 
  },
  image: {
    width: '100%',
    borderRadius: '4px',
    marginBottom: '5px'
  },
  content: {
    fontSize: '14px',
    color: '#333',
    wordWrap: 'break-word'
  }
};