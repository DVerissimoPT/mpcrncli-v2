import firestore, { firebase } from '@react-native-firebase/firestore';

export const orderArrByDateDesc = (arr) => {
    if(Array.isArray(arr)){
        arr.sort((a,b)=>{
            return b.date_sort - a.date_sort
        });
    }
};

export const cleanArr = (arr) => {
    if(Array.isArray(arr)){
        let keys = [];
        let finalArr = [];
        arr.forEach((v,i)=>{
            if(!(keys.includes(v.key))){
                keys.push(v.key);
                finalArr.push(v);
            }
        });
        return finalArr;
    }
}

export const basicCollectionWhereFetch = (collection_name,where_table,where_type,where_query) => {
    return firestore()
    .collection(collection_name)
    .where(where_table,where_type,where_query)
    .get()
}

export const addNotification = (trigger_key,recipient_key,post_key,type) => {

    if(!(trigger_key == recipient_key)){

    let trigger_ref = firestore().doc('users/'+trigger_key);
    let recipient_ref = firestore().doc('users/'+recipient_key);
    let post_ref = firestore().doc('posts/'+post_key);

        switch(type){
            case 'like':
                {
                    firestore()
                    .collection('notifications')
                    .where('notification_from','==',trigger_ref)
                    .where('notification_to','==',recipient_ref)
                    .where('ref_post','==',post_ref)
                    .where('type','==','like')
                    .get().then((qs)=>{
                        if(qs.size == 0){
                            firestore().collection('notifications').add({
                                notification_from : trigger_ref,
                                notification_to : recipient_ref,
                                ref_post : post_ref,
                                notification_date: firebase.firestore.Timestamp.now(),
                                type : type,
                                read : false,
                            }).then(()=>{
                                /**/
                            });
                        }else{
                            
                        }
                    });
                }
            break;
            case 'comment':
                {
                    firestore().collection('notifications').add({
                        notification_from : trigger_ref,
                        notification_to : recipient_ref,
                        ref_post : post_ref,
                        notification_date: firebase.firestore.Timestamp.now(),
                        type : type,
                        read : false,
                    }).then(()=>{
                        /**/
                    });
                }
            break;
        }
    }
};