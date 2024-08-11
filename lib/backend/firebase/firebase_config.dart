import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: const FirebaseOptions(
            apiKey: "AIzaSyCpbFrIHAyw2yAcuO3yhCw8nF0g6fa2PpE",
            authDomain: "dvote-8e5f7.firebaseapp.com",
            projectId: "dvote-8e5f7",
            storageBucket: "dvote-8e5f7.appspot.com",
            messagingSenderId: "1087484133502",
            appId: "1:1087484133502:web:0ad2083ff6d00cce16982f",
            measurementId: "G-3SPLLGWLMF"));
  } else {
    await Firebase.initializeApp();
  }
}
