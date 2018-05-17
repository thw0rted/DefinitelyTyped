// All credit to StackOverflow user Titian Cernicova-Dragomir, question 50369299

/**
 * Utilities to turn an interface that maps event names to callback signatures
 * into a mapped type suitable for creating specialized overloads.
 */

// Invert a mapped type
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// Map the passed type to a particular function signature
type OnSignatures<T, R> = { [P in keyof T]: (event: P, listener: T[P]) => R };

/**
 * Create a mapped type of the supplied interface whose keys are event names,
 * and whose values are the function signature
 *     (event: {interface member name}, listener: {interface member value}) => R
 *
 * @example
 * interface FooEvents {
 *   bar: (baz: string) => void;
 *   catz: (quux: number) => void;
 * }
 * class Foo { on: OnAll<FooEvents, this>; }
 * let foo = new Foo();
 * foo.on("bar", baz => {
 *   baz.trim();      // Works
 *   baz.toFixed();   // Error, string doesn't have toFixed method
 * });
 */
type OnAll<T, R> = UnionToIntersection<OnSignatures<T, R>[keyof T]>;

// Type math is magic
type IsValidArg<T> = T extends object ? keyof T extends never ? false : true : true;
// Works for up to 3 parameters, but you could add more as needed
type AddParameters<T, P> =
    T extends (a: infer A, b: infer B, c: infer C) => infer R ? (
        IsValidArg<C> extends true ? (event: P, a: A, b: B, c: C) => boolean :
        IsValidArg<B> extends true ? (event: P, a: A, b: B) => boolean :
        IsValidArg<A> extends true ? (event: P, a: A) => boolean :
        (event: P) => boolean
    ) : never;
// Compute parameters from function signature
type EmitSignatures<T> = { [P in keyof T]: AddParameters<T[P], P> };

/**
 * Create a mapped type of the supplied interface whose keys are event names,
 * and whose values are the function signature
 *     (event: {interface member name}, {arguments from interface member value}) => boolean
 * Note that all parameters after the first are copied from the value of the
 * supplied interface, which must be a function signature.  Currently supports
 * functions with zero to three arguments (@see {AddParameters}).
 *
 * @example
 * interface FooEvents {
 *   bar: (baz: string) => void;
 *   catz: (quux: number) => void;
 * }
 * class Foo { emit: EmitAll<FooEvents, this>; }
 * let foo = new Foo();
 * foo.emit("bar", "hello");    // Works
 * foo.emit("bar", {x:1});      // Error, second argument must be a string
 */
type EmitAll<T> = UnionToIntersection<EmitSignatures<T>[keyof T]>;
