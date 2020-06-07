const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

//========================================
// create element and render cafe

const renderCafe = (doc) => {
	let li = document.createElement('li');
	let name = document.createElement('span');
	let city = document.createElement('span');
	let cross = document.createElement('div');

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	cross.textContent = 'x';

	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(cross);

	cafeList.appendChild(li);

	//========================================
	// deleting data

	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		// xボタン押したら、親要素のdata-idを取得
		// data-idにはfirebase側のidが設定されてるので、それを使って削除する
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('cafes').doc(id).delete();
	});
};

//========================================
// dbのドキュメントデータを取得
// -> real-time に変更
//
//
//========================================
// db.collection('cafes')
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			renderCafe(doc);
// 		});
// 	});

//========================================
//  real-time listener
//  onSnapshot: collectionに変更があったときにこの関数を呼び出す。コレクションに対する何らかのイベント
//  snapshot.docChangeメソッド: ドキュメントを変更するメソッド

db.collection('cafes')
	.orderBy('city')
	.onSnapshot((snapshot) => {
		let changes = snapshot.docChanges();
		// console.log(changes);  // 各データにはtypeなどが設定されてる。追加済みのやつには'added'など
		changes.map((change) => {
			// console.log(change.doc.data());  // データ本体表示される
			if (change.type == 'added') {
				renderCafe(change.doc);
			} else if (change.type == 'removed') {
				let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
				cafeList.removeChild(li);
			}
		});
	});

//========================================
// saving data

form.addEventListener('submit', (e) => {
	e.preventDefault();
	db.collection('cafes').add({
		name: form.name.value,
		city: form.city.value,
	});
	form.name.value = '';
	form.city.value = '';
});

//========================================
//  dbのドキュメントデータを取得
//
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			console.log(doc.data());
// 		});
// 	});
