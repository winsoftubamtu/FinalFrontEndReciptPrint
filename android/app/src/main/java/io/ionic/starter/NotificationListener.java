//package io.ionic.starter;
//
//import android.os.Bundle;
//import android.service.notification.NotificationListenerService;
//import android.service.notification.StatusBarNotification;
//import android.speech.tts.TextToSpeech;
//import android.speech.tts.Voice;
//import android.util.Log;
//import java.util.Locale;
//import java.util.Set;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//
//
//public class NotificationListener extends NotificationListenerService {
//  private TextToSpeech tts;
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//    Log.i("VoicePayment", "🔹 NotificationListener service created");
//
//    // Initialize Text-to-Speech
//    tts = new TextToSpeech(getApplicationContext(), status -> {
//      if (status == TextToSpeech.SUCCESS) {
//        int result = tts.setLanguage(new Locale("hi", "IN"));
//        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
//          Log.w("VoicePayment", "⚠️ Hindi not supported, falling back to English (en-IN)");
//          tts.setLanguage(Locale.forLanguageTag("en-IN"));
//        } else {
//          Log.i("VoicePayment", "✅ TTS initialized with Hindi (hi-IN)");
//        }
//
//        // Try to set a more natural Indian female voice
//        try {
//          Set<Voice> voices = tts.getVoices();
//          for (Voice v : voices) {
//            if (v.getLocale().equals(new Locale("hi", "IN")) && v.getName().toLowerCase().contains("female")) {
//              tts.setVoice(v);
//              Log.i("VoicePayment", "🎙️ Using Hindi female voice: " + v.getName());
//              break;
//            }
//          }
//        } catch (Exception e) {
//          Log.w("VoicePayment", "⚠️ Could not set Hindi female voice: " + e.getMessage());
//        }
//      } else {
//        Log.e("VoicePayment", "❌ Failed to initialize TextToSpeech");
//      }
//    });
//  }
//
//  @Override
//  public void onNotificationPosted(StatusBarNotification sbn) {
//    try {
//      String packageName = sbn.getPackageName();
//      Log.i("VoicePayment", "📩 New Notification detected from: " + packageName);
//
//      // --- Extract all possible text fields ---
//      String title = "";
//      String text = "";
//      String bigText = "";
//      String lines = "";
//
//      if (sbn.getNotification().extras.getCharSequence("android.title") != null)
//        title = sbn.getNotification().extras.getCharSequence("android.title").toString();
//
//      if (sbn.getNotification().extras.getCharSequence("android.text") != null)
//        text = sbn.getNotification().extras.getCharSequence("android.text").toString();
//
//      if (sbn.getNotification().extras.getCharSequence("android.bigText") != null)
//        bigText = sbn.getNotification().extras.getCharSequence("android.bigText").toString();
//
//      CharSequence[] textLines = sbn.getNotification().extras.getCharSequenceArray("android.textLines");
//      if (textLines != null) {
//        StringBuilder sb = new StringBuilder();
//        for (CharSequence line : textLines) {
//          sb.append(line).append(" ");
//        }
//        lines = sb.toString().trim();
//      }
//
//      String fullText = (title + " " + text + " " + bigText + " " + lines).trim();
//      Log.i("VoicePayment", "📜 Full Notification Text: " + fullText);
//
//      if (fullText.isEmpty()) {
//        Log.w("VoicePayment", "⚠️ Notification text is empty. Skipping...");
//        return;
//      }
//
//      // --- ONLY PAYMENT APPS ---
//      if (packageName.contains("com.google.android.apps.nbu.paisa.user") ||  // GPay
//        packageName.contains("net.one97.paytm") ||                        // Paytm
//        packageName.contains("com.phonepe.app")) {                        // PhonePe
//
//        Log.i("VoicePayment", "💰 Payment App Detected: " + packageName);
//
//        // Try to extract ₹ amount
//        String amount = "";
//        Matcher matcher = Pattern.compile("₹\\s?\\d+[\\.,\\d]*").matcher(fullText);
//        if (matcher.find()) {
//          amount = matcher.group();
//        }
//
//        // Extract sender name
//        String sender = "";
//        if (fullText.toLowerCase().contains("paid you")) {
//          sender = fullText.split("paid you")[0].trim();
//        }
//
//        String speech;
//        if (!sender.isEmpty() && !amount.isEmpty()) {
//          // Example: "रमेश ने आपको ₹50 भेजे हैं"
//          speech = sender + " ने आपको " + amount + " भेजे हैं";
//        } else if (!amount.isEmpty()) {
//          speech = "आपको " + amount + " का भुगतान प्राप्त हुआ है";
//        } else {
//          speech = "";
//        }
//
//        Log.i("VoicePayment", "🔈 Speaking (Hindi): " + speech);
//        speak(speech);
//      } else {
//        Log.i("VoicePayment", "🚫 Ignored app notification: " + packageName);
//      }
//
//    } catch (Exception e) {
//      Log.e("VoicePayment", "❌ Error while processing notification: " + e.getMessage(), e);
//    }
//  }
//
//  private void speak(String message) {
//    if (tts != null) {
//      Log.i("VoicePayment", "🔊 TTS Speaking: " + message);
//      tts.speak(message, TextToSpeech.QUEUE_FLUSH, null, "tts_payment_message");
//    } else {
//      Log.e("VoicePayment", "⚠️ TTS not initialized, cannot speak message");
//    }
//  }
//
//  @Override
//  public void onDestroy() {
//    Log.i("VoicePayment", "🛑 NotificationListener service destroyed");
//    if (tts != null) {
//      tts.stop();
//      tts.shutdown();
//    }
//    super.onDestroy();
//  }
//}


//
//
//package io.ionic.starter;
//import android.content.ComponentName;
//
//import android.os.Bundle;
//import android.service.notification.NotificationListenerService;
//import android.service.notification.StatusBarNotification;
//import android.speech.tts.TextToSpeech;
//import android.speech.tts.Voice;
//import android.util.Log;
//import java.util.Locale;
//import java.util.Set;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//public class NotificationListener extends NotificationListenerService {
//  private TextToSpeech tts;
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//    Log.i("VoicePayment", "🔹 NotificationListener service created");
//
//    // Initialize Text-to-Speech
//    tts = new TextToSpeech(getApplicationContext(), status -> {
//      if (status == TextToSpeech.SUCCESS) {
//        int result = tts.setLanguage(new Locale("mr", "IN")); // Marathi
//        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
//          Log.w("VoicePayment", "⚠️ Marathi not supported, falling back to Hindi (hi-IN)");
//          tts.setLanguage(new Locale("hi", "IN"));
//        } else {
//          Log.i("VoicePayment", "✅ TTS initialized with Marathi (mr-IN)");
//        }
//
//        // Try to set a natural female Indian voice if available
//        try {
//          Set<Voice> voices = tts.getVoices();
//          for (Voice v : voices) {
//            if (v.getLocale().equals(new Locale("mr", "IN")) && v.getName().toLowerCase().contains("female")) {
//              tts.setVoice(v);
//              Log.i("VoicePayment", "🎙️ Using Marathi female voice: " + v.getName());
//              break;
//            }
//          }
//        } catch (Exception e) {
//          Log.w("VoicePayment", "⚠️ Could not set Marathi female voice: " + e.getMessage());
//        }
//      } else {
//        Log.e("VoicePayment", "❌ Failed to initialize TextToSpeech");
//      }
//    });
//  }
//
//  @Override
//  public void onNotificationPosted(StatusBarNotification sbn) {
//    try {
//      String packageName = sbn.getPackageName();
//      Log.i("VoicePayment", "📩 New Notification detected from: " + packageName);
//
//      // --- Extract all possible text fields ---
//      String title = "";
//      String text = "";
//      String bigText = "";
//      String lines = "";
//
//      if (sbn.getNotification().extras.getCharSequence("android.title") != null)
//        title = sbn.getNotification().extras.getCharSequence("android.title").toString();
//
//      if (sbn.getNotification().extras.getCharSequence("android.text") != null)
//        text = sbn.getNotification().extras.getCharSequence("android.text").toString();
//
//      if (sbn.getNotification().extras.getCharSequence("android.bigText") != null)
//        bigText = sbn.getNotification().extras.getCharSequence("android.bigText").toString();
//
//      CharSequence[] textLines = sbn.getNotification().extras.getCharSequenceArray("android.textLines");
//      if (textLines != null) {
//        StringBuilder sb = new StringBuilder();
//        for (CharSequence line : textLines) {
//          sb.append(line).append(" ");
//        }
//        lines = sb.toString().trim();
//      }
//
//      String fullText = (title + " " + text + " " + bigText + " " + lines).trim();
//      Log.i("VoicePayment", "📜 Full Notification Text: " + fullText);
//
//      if (fullText.isEmpty()) {
//        Log.w("VoicePayment", "⚠️ Notification text is empty. Skipping...");
//        return;
//      }
//
//      // --- ONLY PAYMENT APPS ---
//      if (packageName.contains("com.google.android.apps.nbu.paisa.user") ||  // GPay
//        packageName.contains("net.one97.paytm") ||                        // Paytm
//        packageName.contains("com.phonepe.app")) {                        // PhonePe
//
//        String appName = "";
//        if (packageName.contains("google")) appName = "GPay";
//        else if (packageName.contains("phonepe")) appName = "PhonePe";
//        else if (packageName.contains("paytm")) appName = "Paytm";
//
//        Log.i("VoicePayment", "💰 Payment App Detected: " + appName);
//
//        // Extract ₹ amount
//        String amount = "";
//        Matcher matcher = Pattern.compile("₹\\s?\\d+[\\.,\\d]*").matcher(fullText);
//        if (matcher.find()) {
//          amount = matcher.group();
//        }
//
//        // Determine direction (received or sent)
//        String speech = "";
//        String lower = fullText.toLowerCase();
//
//        if (lower.contains("received") || lower.contains("credited") || lower.contains("paid you") || lower.contains("got")) {
//          // Received payment
//          if (!amount.isEmpty())
//            speech = appName + " वर " + amount + " प्राप्त झाले.";
//          else
//            speech = appName + " वर पेमेंट प्राप्त झाले.";
//        }
//        else if (lower.contains("debited") || lower.contains("you paid") || lower.contains("sent to")) {
//          // Sent payment
//          if (!amount.isEmpty())
//            speech = appName + " वरून " + amount + " पाठवले गेले.";
//          else
//            speech = appName + " वरून पेमेंट पाठवले गेले.";
//        }
//
//        if (!speech.isEmpty()) {
//          Log.i("VoicePayment", "🔈 Speaking (Marathi): " + speech);
//          speak(speech);
//        } else {
//          Log.i("VoicePayment", "⚠️ No recognizable payment direction or amount.");
//        }
//      } else {
//        Log.i("VoicePayment", "🚫 Ignored app notification: " + packageName);
//      }
//
//    } catch (Exception e) {
//      Log.e("VoicePayment", "❌ Error while processing notification: " + e.getMessage(), e);
//    }
//  }
//
//  private void speak(String message) {
//    if (tts != null) {
//      Log.i("VoicePayment", "🔊 TTS Speaking: " + message);
//      tts.speak(message, TextToSpeech.QUEUE_FLUSH, null, "tts_payment_message");
//    } else {
//      Log.e("VoicePayment", "⚠️ TTS not initialized, cannot speak message");
//    }
//  }
//
//  @Override
//  public void onDestroy() {
//    Log.i("VoicePayment", "🛑 NotificationListener service destroyed");
//    if (tts != null) {
//      tts.stop();
//      tts.shutdown();
//    }
//    super.onDestroy();
//  }
//
//  @Override
//  public void onListenerDisconnected() {
//    Log.w("VoicePayment", "⚠️ Notification Listener disconnected — trying to reconnect...");
//
//    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
//      try {
//        requestRebind(new ComponentName(getApplicationContext(), NotificationListener.class));
//        Log.i("VoicePayment", "🔁 Listener rebind requested successfully");
//      } catch (Exception e) {
//        Log.e("VoicePayment", "❌ Failed to rebind listener: " + e.getMessage());
//      }
//    } else {
//      Log.w("VoicePayment", "⚠️ Rebind not supported below Android N (API 24)");
//    }
//  }
//
//
//}










//below code is change and well code for the customers

//package io.ionic.starter;
//
//import android.app.NotificationManager;
//import android.content.ComponentName;
//import android.content.Context;
//import android.content.Intent;
//import android.os.Build;
//import android.service.notification.NotificationListenerService;
//import android.service.notification.StatusBarNotification;
//import android.speech.tts.TextToSpeech;
//import android.speech.tts.Voice;
//import android.util.Log;
//
//import androidx.core.app.NotificationManagerCompat;
//
//import java.util.Locale;
//import java.util.Set;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//public class NotificationListener extends NotificationListenerService {
//  private TextToSpeech tts;
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//    Log.i("VoicePayment", "🔹 NotificationListener created");
//
//    // Check permission at startup
//    if (!NotificationManagerCompat.getEnabledListenerPackages(getApplicationContext())
//      .contains(getApplicationContext().getPackageName())) {
//      Log.e("VoicePayment", "❌ Notification access not granted! Opening settings...");
//      Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
//      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//      startActivity(intent);
//      return;
//    }
//
//    // Initialize TTS
//    tts = new TextToSpeech(getApplicationContext(), status -> {
//      if (status == TextToSpeech.SUCCESS) {
//        int result = tts.setLanguage(new Locale("mr", "IN"));
//        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
//          Log.w("VoicePayment", "⚠️ Marathi not supported, using Hindi");
//          tts.setLanguage(new Locale("hi", "IN"));
//        }
//        try {
//          Set<Voice> voices = tts.getVoices();
//          for (Voice v : voices) {
//            if (v.getLocale().equals(new Locale("mr", "IN")) &&
//              v.getName().toLowerCase().contains("female")) {
//              tts.setVoice(v);
//              Log.i("VoicePayment", "🎙️ Marathi female voice: " + v.getName());
//              break;
//            }
//          }
//        } catch (Exception e) {
//          Log.w("VoicePayment", "⚠️ Voice select failed: " + e.getMessage());
//        }
//      } else {
//        Log.e("VoicePayment", "❌ TTS init failed");
//      }
//    });
//  }
//
//  @Override
//  public void onNotificationPosted(StatusBarNotification sbn) {
//    try {
//      String pkg = sbn.getPackageName();
//      Log.i("VoicePayment", "📩 From: " + pkg);
//
//      // Extract notification text
//      String title = getExtra(sbn, "android.title");
//      String text = getExtra(sbn, "android.text");
//      String bigText = getExtra(sbn, "android.bigText");
//      String full = (title + " " + text + " " + bigText).trim();
//
//      Log.i("VoicePayment", "📜 Text: " + full);
//
//      if (full.isEmpty()) return;
//
//      if (pkg.contains("google.android.apps.nbu.paisa.user") || // GPay
//        pkg.contains("net.one97.paytm") ||                // Paytm
//        pkg.contains("com.phonepe.app")) {                // PhonePe
//
//        String app = pkg.contains("google") ? "GPay" :
//          pkg.contains("phonepe") ? "PhonePe" : "Paytm";
//
//        String amt = "";
//        Matcher m = Pattern.compile("₹\\s?\\d+[\\.,\\d]*").matcher(full);
//        if (m.find()) amt = m.group();
//
//        String speech = "";
//        String lower = full.toLowerCase();
//
//        if (lower.contains("received") || lower.contains("credited") ||
//          lower.contains("paid you") || lower.contains("got")) {
//          speech = amt.isEmpty()
//            ? app + " वर पेमेंट प्राप्त झाले."
//            : app + " वर " + amt + " प्राप्त झाले.";
//        } else if (lower.contains("debited") || lower.contains("you paid") ||
//          lower.contains("sent to")) {
//          speech = amt.isEmpty()
//            ? app + " वरून पेमेंट पाठवले गेले."
//            : app + " वरून " + amt + " पाठवले गेले.";
//        }
//
//        if (!speech.isEmpty()) speak(speech);
//      }
//
//    } catch (Exception e) {
//      Log.e("VoicePayment", "❌ Error: " + e.getMessage(), e);
//    }
//  }
//
//  private String getExtra(StatusBarNotification sbn, String key) {
//    CharSequence cs = sbn.getNotification().extras.getCharSequence(key);
//    return cs != null ? cs.toString() : "";
//  }
//
//  private void speak(String msg) {
//    if (tts != null) {
//      Log.i("VoicePayment", "🔊 Speaking: " + msg);
//      tts.speak(msg, TextToSpeech.QUEUE_FLUSH, null, "tts_payment_message");
//    }
//  }
//
//  @Override
//  public void onListenerDisconnected() {
//    Log.w("VoicePayment", "⚠️ Listener disconnected, trying to rebind...");
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//      try {
//        requestRebind(new ComponentName(this, NotificationListener.class));
//        Log.i("VoicePayment", "🔁 Listener rebind requested");
//      } catch (Exception e) {
//        Log.e("VoicePayment", "❌ Rebind failed: " + e.getMessage());
//      }
//    }
//  }
//
//  @Override
//  public void onDestroy() {
//    Log.i("VoicePayment", "🛑 Listener destroyed");
//    if (tts != null) {
//      tts.stop();
//      tts.shutdown();
//    }
//    super.onDestroy();
//  }
//}














//BELOW CODE IS FOR THE GIVING FULL PERMISSION FOR THE APP
package io.ionic.starter;

import android.content.ComponentName;
import android.os.Build;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.speech.tts.TextToSpeech;
import android.util.Log;

import androidx.core.app.NotificationManagerCompat;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NotificationListener extends NotificationListenerService {
  private TextToSpeech tts;

  @Override
  public void onCreate() {
    super.onCreate();
    Log.i("VoicePayment", "NotificationListener created");

    // IMPORTANT: Do NOT launch settings from a background service.
    // App UI must request the notification permission (open settings) explicitly when user taps a button.

    // Init TTS simply
    tts = new TextToSpeech(getApplicationContext(), status -> {
      if (status == TextToSpeech.SUCCESS) {
        // prefer Marathi if available, else fallback to default locale
        Locale marathi = new Locale("mr", "IN");
        int res = tts.setLanguage(marathi);
        if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
          Log.w("VoicePayment", "Marathi TTS not available, using default locale");
          tts.setLanguage(Locale.getDefault());
        }
      } else {
        Log.e("VoicePayment", "TTS init failed");
      }
    });
  }

  @Override
  public void onNotificationPosted(StatusBarNotification sbn) {
    try {
      // Ensure notification access is enabled before processing
      if (!NotificationManagerCompat.getEnabledListenerPackages(getApplicationContext())
        .contains(getApplicationContext().getPackageName())) {
        Log.w("VoicePayment", "Notification access not granted — skipping processing");
        return;
      }

      CharSequence titleCs = sbn.getNotification().extras.getCharSequence("android.title");
      CharSequence textCs = sbn.getNotification().extras.getCharSequence("android.text");
      CharSequence bigTextCs = sbn.getNotification().extras.getCharSequence("android.bigText");

      String title = titleCs != null ? titleCs.toString() : "";
      String text = textCs != null ? textCs.toString() : "";
      String bigText = bigTextCs != null ? bigTextCs.toString() : "";

      String full = (title + " " + text + " " + bigText).trim();
      if (full.isEmpty()) return;

      Log.i("VoicePayment", "Notification text: " + (full.length() > 200 ? full.substring(0, 200) + "..." : full));

      // Generic detection: look for rupee sign and payment-related keywords.
      // Avoid checking package names to reduce "spyware" fingerprinting.
      boolean hasRupee = full.contains("₹") || full.toLowerCase().contains("inr") || containsNumericAmount(full);
      if (!hasRupee) return; // not a payment-like notification

      String lower = full.toLowerCase();

      // Common positive/credit words and debit words (generic)
      boolean credit = containsAny(lower, "credited", "received", "received", "deposit", "credited to", "payment received", "amount received", "you have received");
      boolean debit  = containsAny(lower, "debited", "withdrawn", "payment sent", "paid", "sent to", "payment made", "transaction of");

      String amt = extractAmount(full); // returns formatted amount or empty

      String speech = "";
      if (credit && !amt.isEmpty()) {
        speech = amt + " प्राप्त झाले.";
      } else if (credit) {
        speech = "पेमेंट प्राप्त झाले.";
      } else if (debit && !amt.isEmpty()) {
        speech = amt + " पाठवले गेले.";
      } else if (debit) {
        speech = "पेमेंट पाठवले गेले.";
      } else {
        // If rupee found but keywords not explicit, speak a neutral message optionally
        if (!amt.isEmpty()) {
          speech = amt + " संबंधित नोटिफिकेशन प्राप्त झाले.";
        } else {
          // nothing confidently identified — skip to avoid false positives
          return;
        }
      }

      // Speak the message
      speak(speech);

    } catch (Exception e) {
      Log.e("VoicePayment", "Error processing notification", e);
    }
  }

  private static boolean containsAny(String src, String... keys) {
    for (String k : keys) if (src.contains(k)) return true;
    return false;
  }

  // quick numeric rupee detection: presence of digits near ₹ or plain numbers with separators
  private static boolean containsNumericAmount(String s) {
    // Example matches: 100, 1,000, 1.000,00, 1,00,000
    Pattern p = Pattern.compile("\\d{1,3}([,\\.]\\d{2,3})*");
    Matcher m = p.matcher(s);
    return m.find();
  }

  private static String extractAmount(String s) {
    try {
      // Match patterns like: ₹ 1,234 or ₹1,234.56 or INR 1234
      Pattern p = Pattern.compile("(?:₹\\s?\\d+[\\d,\\.]*|inr\\s?\\d+[\\d,\\.]*)", Pattern.CASE_INSENSITIVE);
      Matcher m = p.matcher(s);
      if (m.find()) {
        String v = m.group().trim();
        // normalize small issues
        return v.replaceAll("(?i)inr", "").trim();
      }
    } catch (Exception e) {
      Log.w("VoicePayment", "amount extract failed", e);
    }
    return "";
  }

  private void speak(String msg) {
    if (tts == null) return;
    Log.i("VoicePayment", "Speaking: " + msg);
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        tts.speak(msg, TextToSpeech.QUEUE_FLUSH, null, "tts_payment_message");
      } else {
        tts.speak(msg, TextToSpeech.QUEUE_FLUSH, null);
      }
    } catch (Exception e) {
      Log.w("VoicePayment", "TTS speak failed", e);
    }
  }

  @Override
  public void onListenerDisconnected() {
    Log.w("VoicePayment", "Listener disconnected");
    // requestRebind is OK but keep it simple and safe
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      try {
        requestRebind(new ComponentName(this, NotificationListener.class));
      } catch (Exception e) {
        Log.w("VoicePayment", "requestRebind failed", e);
      }
    }
  }

  @Override
  public void onDestroy() {
    if (tts != null) {
      try {
        tts.stop();
        tts.shutdown();
      } catch (Exception ignored) {}
    }
    super.onDestroy();
  }
}



