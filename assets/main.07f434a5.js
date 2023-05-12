import "/dynamic-import-polyfill.b3685604.js";
import {f as e, l as t, a, s as o, b as n, d} from "/vendor.862a424b.js";
const c = {
    apiKey: "AIzaSyCu8FY9LoMezLVBZ6P9ObE1aD_6W3lD7oY",
    authDomain: "video-chat-1f4d1-31213.firebaseapp.com",
    projectId: "video-chat-1f4d1-31213",
    storageBucket: "video-chat-1f4d1-31213.appspot.com",
    messagingSenderId: "895567670584",
    appId: "1:895567670584:web:f6c36b30a6835c1e91a5cd"
    measurementId: ""
};
e.apps.length || e.initializeApp(c);
const s = e.firestore()
  , i = new RTCPeerConnection({
    iceServers: [{
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
    }],
    iceCandidatePoolSize: 10
});
let l = null
  , r = null;
const m = document.getElementById("webcamButton")
  , p = document.getElementById("webcamVideo")
  , g = document.getElementById("callButton")
  , h = document.getElementById("callInput")
  , u = document.getElementById("answerButton")
  , w = document.getElementById("remoteVideo")
  , f = document.getElementById("hangupButton");
m.onclick = async()=>{
    l = await navigator.mediaDevices.getUserMedia({
        video: !0,
        audio: !0
    }),
    r = new MediaStream,
    l.getTracks().forEach((e=>{
        i.addTrack(e, l)
    }
    )),
    i.ontrack = e=>{
        e.streams[0].getTracks().forEach((e=>{
            r.addTrack(e)
        }
        ))
    }
    ,
    p.srcObject = l,
    w.srcObject = r,
    g.disabled = !1,
    u.disabled = !1,
    m.disabled = !0
}
,
g.onclick = async()=>{
    const e = s.collection("calls").doc()
      , t = e.collection("offerCandidates")
      , a = e.collection("answerCandidates");
    h.value = e.id,
    i.onicecandidate = e=>{
        e.candidate && t.add(e.candidate.toJSON())
    }
    ;
    const o = await i.createOffer();
    await i.setLocalDescription(o);
    const n = {
        sdp: o.sdp,
        type: o.type
    };
    await e.set({
        offer: n
    }),
    e.onSnapshot((e=>{
        const t = e.data();
        if (!i.currentRemoteDescription && (null == t ? void 0 : t.answer)) {
            const e = new RTCSessionDescription(t.answer);
            i.setRemoteDescription(e)
        }
    }
    )),
    a.onSnapshot((e=>{
        e.docChanges().forEach((e=>{
            if ("added" === e.type) {
                const t = new RTCIceCandidate(e.doc.data());
                i.addIceCandidate(t)
            }
        }
        ))
    }
    )),
    f.disabled = !1
}
,
u.onclick = async()=>{
    const e = h.value
      , t = s.collection("calls").doc(e)
      , a = t.collection("answerCandidates")
      , o = t.collection("offerCandidates");
    i.onicecandidate = e=>{
        e.candidate && a.add(e.candidate.toJSON())
    }
    ;
    const n = (await t.get()).data().offer;
    await i.setRemoteDescription(new RTCSessionDescription(n));
    const d = await i.createAnswer();
    await i.setLocalDescription(d);
    const c = {
        type: d.type,
        sdp: d.sdp
    };
    await t.update({
        answer: c
    }),
    o.onSnapshot((e=>{
        e.docChanges().forEach((e=>{
            if (console.log(e),
            "added" === e.type) {
                let t = e.doc.data();
                i.addIceCandidate(new RTCIceCandidate(t))
            }
        }
        ))
    }
    ))
}
;
!async function() {
    const e = await t("https://teachablemachine.withgoogle.com/models/cqbb-nRkh/model.json");
    console.log("Model Loaded");
    const c = await fetch("https://teachablemachine.withgoogle.com/models/cqbb-nRkh/metadata.json").then((e=>e.json()));
    console.log(c),
    navigator.mediaDevices.getUserMedia({
        video: !0,
        audio: !1
    }).then((t=>{
        const s = document.getElementById("remoteVideo");
        s.srcObject = t,
        s.play(),
        setInterval((async()=>{
            const t = document.createElement("canvas")
              , i = t.getContext("2d");
            t.width = s.videoWidth,
            t.height = s.videoHeight,
            i.drawImage(s, 0, 0, t.width, t.height);
            const l = i.getImageData(0, 0, t.width, t.height)
              , r = a(l).resizeNearestNeighbor([224, 224]).toFloat()
              , m = o(127.5)
              , p = r.sub(m).div(m)
              , g = p.reshape([1, 224, 224, 3])
              , h = await e.predict(g)
              , u = await h.data();
            console.log(u);
            const w = n(h, 1).dataSync()[0]
              , f = c.labels[w];
            console.log(f),
            document.getElementById("translatedText").innerHTML = f,
            r.dispose(),
            m.dispose(),
            p.dispose(),
            g.dispose(),
            d([h, u])
        }
        ), 1e3 / 30)
    }
    ))
}();
