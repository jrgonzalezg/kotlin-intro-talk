<!-- .slide: style="text-align: left;" -->

### Kotlin: A language for productive developers <!-- .element: style="text-align: center;" -->

Olmo Gallegos ([@voghDev](https://twitter.com/voghDev))

Juan Ramón González González ([@jrgonzalezg](https://twitter.com/jrgonzalezg))

---

## Introduction

- The Kotlin language
  - Basics
  - Null-safety
  - Extension functions
  - Kotlin on Android
- Functional Programming (FP) basics
  - Lambda expressions
  - FP operators available in Kotlin?
- Advanced topics
  - Advanced Types
  - Domain Specific Languages (DSLs)
  - Coroutines
- To know more

Note: Consider talking about anko and other concrete details on Android Dev

---

## The Kotlin programming language

- Expressive
- Type-safe
- Functional (we’ll focus on that later)
- Created by JetBrains
- Official ! First class support in Android since Google I/O 2017
- Official support in Spring Framework 5.0 too (final version ~ July 2017))
- Made by and for Java “sufferers”

---

## Multiple targets

- Goal: Make it possible to use Kotlin for all parts of any project
- Kotlin/JVM
  - All features and the whole standard library, production-ready
  - 100% Interoperable with Java and Android
- JavaScript
  - All language features since Kotlin 1.1 and a large part of the standard library
  - JavaScript interoperability (including Node.js and browser support)
- Kotlin / Native
  - Machine code through LLVM
  - Mac OS X 10.10 and later (x86-64), x86-64 Ubuntu Linux (14.04, 16.04 and later), Apple iOS (arm64), Raspberry Pi, cross-compiled on Linux host, more to come...
  - Not yet feature complete

---

## Features

- Data classes
- Inheritance (open, closed classes)
- Interfaces with attrs, default methods
- Generics with default template methods
- Default values for attributes
- Smart casts
- with, apply, let functions
- Coroutines! Since Kotlin 1.1
- Multiple inheritance
- Testability (JUnit4 100% supported)

---

<!-- .slide: style="text-align: left;" -->

## Data classes

- Java

```java
public class Book {
  int id;
  String title;
  int coverId;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public int getCoverId() {
    return coverId;
  }

  public void setCoverId(int coverId) {
    this.coverId = coverId;
  }
}
```
<!-- .element: style="font-size: 30%" -->

- Kotlin

```kotlin
data class Book(val id: Int, val title: String, val coverId: Int)
```

---

## Null-Safety

Java (all non-primitive types are nullable in an unsafe way)

```java
Book book = null;
book.getTitle();
```

This code causes NPE!

---

## Null-Safety

Kotlin - Trying to use null in Non-Null types

```kotlin
val book: Book = null
print(book.title)
```

This code does not compile - "null can not be a value of a non-null type Book"

![null1](img/null1.png)

---

## Null-Safety - Nullable types

```kotlin
val book: Book? = null
print(book.title)
```

This code does not compile - "only safe (?.) or non-null asserted (!!) calls are allowed on a nullable receiver of type Book"

![null2](img/null2.png)

One way to make this work would be using the ? operator

---

## Null-Safety - Nullable types

```kotlin
val book: Book? = null
print(book?.title)
```
This code works, prints nothing. "title" is never evaluated because "book" is null. NPE is avoided

---

## Null-Safety - Nullable types

You can also assert non-null using the \!\! operator

```kotlin
val book: Book? = null
print(book!!.title)
```

This causes NPE, as we are forcing "book.title" to be evaluated, but "book" is null. Would behave similar to Java

---

## Inheritance

Given the previous data class "Book"

```kotlin
data class Book(val id: Int, val title: String, val coverId: Int)
```

We want to create a subclass called "Novel"

```kotlin
class Novel : Book(id = 0, title = "", coverId = 0) {
    var summary : String = ""
}
```

We find that we can't. Compiler yields "this type is final, so we can't inherit from it"

![inheritance1](img/inheritance1.png)

Book needs to be declared as open class for inheritance to work

```kotlin
open class Book(val id: Int, val title: String, val coverId: Int)
```

---

## Interfaces with attributes and default methods

In Kotlin, interfaces can have attributes

Java

```java
public interface Request<T> {
  T client;

  void execute();
}
```

Kotlin

```kotlin
interface Request<T> {
  val client : T

  fun execute()
}
```

---

## Interfaces with attributes and default methods

Java: Default template methods are supported in abstract classes

Kotlin: Just add a method body

```java
public abstract class Request<T> {
  T client;

  void execute() {
    // Default implementation
  }
}
```

Kotlin

```kotlin
interface Request<T> {
  val client : T

  fun execute() {
    // Default implementation
  }
}
```

---

## Default values for attributes

Java: Telescoping constructor problem - Builder pattern

Kotlin: Attributes with default values to the rescue!

```kotlin
data class Book(val id: Int = 0, val title: String = "", val coverId: Int = 0)

fun initBooks() {
  val books = listOf(
    Book(id = 1),
    Book(id = 2, title = "Moby dick"),
    Book(id = 3, title = "Sherlock Holmes", coverId = 254),
    Book()
  )

  books.forEach {
    print(it.title)
  }
}
```

---

## Smart casts

Null safety

```kotlin
val book : Book?

book.title

book?.title

if (book != null) {
  book.title
}
```

Smart type casts

```kotlin
open class Book(val id: Int = 0, val title: String = "", val coverId: Int = 0)

class Novel : Book(id = 0, title = "", coverId = 0) {
  var summary: String = ""
}

val novel: Book = Novel()

(novel as Novel).summary = "Once upon a time..."

if (novel is Novel) {
  novel.summary = "Once upon a time..."
}
```

---

## with, let, apply

Java

```java
final TextView textView = new TextView(this);
textView.setText("Hello!");
textView.setTextSize(16f);
textView.setTextColor(ContextCompat.getColor(this, android.R.color.white));
```
Kotlin

```kotlin
val textView : TextView = TextView(this)
with(textView) {
    text = ""
    textSize = 16f
    setTextColor(color(android.R.color.white))
}
```

Optional receiver can't be used in this case

---

## with, let, apply

Java

```java
LinearLayout linearLayout = new LinearLayout(this);
if (textView != null) {
    linearLayout.addView(textView);
    setContentView(linearLayout);
}
```
Kotlin

```kotlin
val linearLayout = LinearLayout(this)
textView?.let {
    linearLayout.addView(it)
    setContentView(linearLayout)
}
```

let won't be applied if textView is null

---

## with, let, apply

Java

```java
TextView textView = new TextView(this);
textView.setText("Hello!");
textView.setTextSize(16f);
textView.setTextColor(ContextCompat.getColor(this, android.R.color.white));
```
Kotlin

```kotlin
val textView: TextView = TextView(this).apply {
    text = "Hello!"
    textSize = 16f
    setTextColor(color(android.R.color.white))
}
```

textView can also be optional and this code will still work

---

## Advanced Types

Note: [Juanra speaks] This slide is just to let the crowd know that we are switching to a new section

%%%

### Type Hierarchy

- Any
  - Any? is the root of the hierarchy (a supertype of any other type)
  - Any is a subtype of Any? and the root of the Non-Null types

- Unit
  - A type with only one value: the Unit object
  - Corresponds to the void type in Java

%%%

### Type Hierarchy

- Nothing
  - Nothing has no instances
  - Represents *a value that never exists*
  - Example: Functions that never return (always throw an exception)
  - Bottom type: It is a subtype of any other type

```kotlin
public inline fun TODO(reason: String): Nothing =
  throw NotImplementedError("An operation is not implemented: $reason")

fun doSomething: A = TODO("This should do something!") // Valid implementation
```

%%%

### Type Hierarchy

- Mistaeks I Hav Made: A Whirlwind Tour of the Kotlin Type Hierarchy
  - Good additional explanation of Kotlin Types
  - Relation between Nullable and Non-Null Types

  ![nullable-hierarchy](img/nullable-hierarchy.png)
  - [http://natpryce.com/articles/000818.html](http://natpryce.com/articles/000818.html)

%%%

### Variance

- Definition: `A <: B` if `A` is a subtype of `B`

- What if we have generics (*type constructors*) like `List`?

  - Covariant: `interface List<out A>`
    - If `A <: B` then `List<A> <: List<B>`

  - Contravariant: `interface List<in A>`
    - If `A <: B` then `List<A> >: List<B>`

  - Invariant: `interface List<A>`
    - Neither `List<A>` nor `List<B>` are a subtype of the other

%%%

### Variance

```kotlin
interface List<out A> {
  fun get(index: Int): A // Safe
  fun add(a: A): Boolean // Unsafe
}
```

```kotlin
var cats: List<Cat> = listOf(cat1, cat2, cat3)
var animals: List<Animal> = cats

val animal = animals.get(0) // Ok!
animals.add(dog1) // Problem - Adding a dog to a list of cats!
```

- List in Kotlin is covariant - Why?
  - It is read-only so A never appears in a contravariant position
  <!-- .element: class="fragment" data-fragment-index="1" -->
  - MutableList is invariant
  <!-- .element: class="fragment" data-fragment-index="2" -->
  - You can control variance and the compiler enforces it
  <!-- .element: class="fragment" data-fragment-index="3" -->
  - Use @UnsafeVariance annotation if you know something is safe despite it appears in an unsafe position
  <!-- .element: class="fragment" data-fragment-index="3" -->

%%%

### Algebraic Data Types (ADTs) - Product Types

- Seen in the wild as: Tuples, Records, POJOs…
- Directly supported in most languages
- Kotlin: Ideally as a data class

```kotlin
data class Book(val id: Int, val title: String, val coverId: Int)
```

- Always contains an id, a title and a coverId
- There are as many possible inhabitants of the type as the product of the number of values in each of the composing subtypes

%%%

### Algebraic Data Types (ADTs) - Sum Types

- Also named: Coproducts, Tagged Types, Disjoint Unions or Variant Types
- No direct support on many languages
- Kotlin: Use sealed classes

```kotlin
sealed class BookResult {
    class  BookFound(val book: Book) : BookResult()
    object BookNotFound : BookResult()
    object BookUnavailable : BookResult()
}
```

- It can contain only one of the enclosed types and nothing else
- As many possible inhabitants as the sum of inhabitants on each subtype

%%%

### Algebraic Data Types (ADTs) - Example

- Based on [https://fsharpforfunandprofit.com/ddd/](https://fsharpforfunandprofit.com/ddd/)

```kotlin
typealias ContactName = String
data class Contact(val name: ContactName, val primaryContactInfo: ContactInfo, val secondaryContactInfo: ContactInfo? = null)

sealed class ContactInfo {
    class EmailContactInfo(val email: String): ContactInfo()
    class PostalContactInfo(val address: String): ContactInfo()
}

abstract fun sendEmail(emailContactInfo: EmailContactInfo) // Somewhere

fun sendMessageUsingPrimaryContactInfo(contact: Contact): Unit =
  when (contact.primaryContactInfo) {
    is ContactInfo.EmailContactInfo -> sendEmail(contact.primaryContactInfo)
    is ContactInfo.PostalContactInfo -> TODO() // NotImplementedError
  }
```

- Combines product and sum types to better model the domain
- Ideal for domain-driven design
- A Contact requires a name and at least a primaryContactInfo
- It is not possible to create a contact with no primary contact info (or null)
- when branches are autocompleted, include smarcasts and the compiler ensures you handle all ContactInfo options => Less tests
- TODO() => Runtime Exception, add to static code analysis (detekt in Kotlin, checkstyle, findbugs)

%%%

### Higher-Kinded Types (HKTs)

- Generics only allow to abstract over the enclosed type

- What if we also want to abstract over the type constructor itself?

- It is allowed on languages like Haskell or Scala (F[\_])

- Kotlin does not support this directly

- **kategory\!** <!-- .element: class="fragment" -->

%%%

### kategory: Functional Data Types and abstractions for Kotlin
  - Custom encoding to allow defining HKTs and type classes
  - Inspired by highj: [https://github.com/highj/highj](https://github.com/highj/highj)
  - Based on Cats: [http://typelevel.org/cats/](http://typelevel.org/cats/)
  - With Free monads!
    - Totally separate program definition from program interpretation
  - [https://github.com/kategory/kategory](https://github.com/kategory/kategory)

---

## Domain Specific Languages (DSLs)

- Life is Great and Everything Will Be Ok, Kotlin is Here (Google I/O '17 - [https://www.youtube.com/watch?v=fPzxfeDJDzY](https://www.youtube.com/watch?v=fPzxfeDJDzY))

```kotlin
val db: SQLiteDatabase = // ...
db.transaction {
    delete("users", "first_name = ?", arrayOf("jake"))
    // ….
}

inline fun SQLiteDatabase.transaction(body: SQLiteDatabase.() -> Unit) {
    beginTransaction()
    try {
        body()
        setTransactionSuccessful()
    } finally {
        endTransaction()
    }
}
```

---

## Coroutines

- Computations that can be suspended without blocking a thread
- Very lightweight: Millions of coroutines can run on a few threads
- A suspended coroutines does not consume a thread
- Allow to express an asynchronous computation on a sequential way
- No need to use callbacks
- Experimental feature on Kotlin 1.1 (API may still change)
- Implemented through compiler transformations, no OS / VM support  needed
- Language support: Suspending functions (suspend keyword)
- Low level core API in the Kotlin Standard Library
- High level APIs that can be used directly in the user code

---

## Coroutines

[https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md)

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```

---

## Coroutines

```kotlin
fun main(args: Array<String>) = runBlocking<Unit> {
    val time = measureTimeMillis {
        val one = async(CommonPool) { doSomethingUsefulOne() }
        val two = async(CommonPool) { doSomethingUsefulTwo() }
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
}
```

It produces something like this:

The answer is 42

Completed in 1017 ms

---

## To know more

- References
  - Documentation - Kotlin Programming Language
    - [https://kotlinlang.org/docs/](https://kotlinlang.org/docs/)
  - Kotlin and Android | Android Developers
  - [https://developer.android.com/kotlin/index.html](https://developer.android.com/kotlin/index.html)
  - Books
    - Kotlin for Android Developers - Antonio Leiva
      - [https://leanpub.com/kotlin-for-android-developers/](https://leanpub.com/kotlin-for-android-developers/)
    - Kotlin in Action - Dmitry Jemerov and Svetlana Isakova
      - [https://www.manning.com/books/kotlin-in-action](https://www.manning.com/books/kotlin-in-action)
  - Lambda World - October 26th & 27th, 2017: [http://www.lambda.world/](http://www.lambda.world/)
    - Hadi Hariri - VP of Developer Advocacy, JetBrains - Kotlin talk

---

## To know more

- HelloKotlin
  - Some learning and feature testing with the Kotlin language
  - Model View Presenter (MVP)
  - Repository Pattern
  - Many tests (reword this)
  - Single God Package, Thermosiphon Samples
  - [https://github.com/voghDev/HelloKotlin](https://github.com/voghDev/HelloKotlin)
- OpenLibraryApp
  - Sample Android App to query and display Open Library data
  - Dependency Injection (DI) with Dagger 2
  - Clean Architecture, Repository Pattern, MVP
  - Domain-driven design, Package by feature
  - Functional Programming (FP), Coroutines
  - [https://github.com/jrgonzalezg/OpenLibraryApp](https://github.com/jrgonzalezg/OpenLibraryApp)

---

<!-- .slide: style="text-align: left;" -->

### Thanks! <!-- .element: style="text-align: center;" -->

Olmo Gallegos ([@voghDev](https://twitter.com/voghDev))

Juan Ramón González González ([@jrgonzalezg](https://twitter.com/jrgonzalezg))

[https://github.com/jrgonzalezg/kotlin-intro-talk](https://github.com/jrgonzalezg/kotlin-intro-talk)

