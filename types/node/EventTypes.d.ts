// StackOverflow user Titian Cernicova-Dragomir, question 50369299

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type OnSignatures<T> = { [P in keyof T]: (event: P, listener: T[P]) => this };
type OnAll<T> = UnionToIntersection<OnSignatures<T>[keyof T]>

type IsValidArg<T> = T extends object ? keyof T extends never ? false : true : true;
    // Works for up to 3 parameters, but you could add more as needed
type AddParameters<T, P> =
    T extends (a: infer A, b: infer B, c: infer C) => infer R ? (
        IsValidArg<C> extends true ? (event: P, a: A, b: B, c: C) => boolean :
        IsValidArg<B> extends true ? (event: P, a: A, b: B) => boolean :
        IsValidArg<A> extends true ? (event: P, a: A) => boolean :
        (event: P) => boolean
    ) : never;

type EmitSignatures<T> = { [P in keyof T]: AddParameters<T[P], P> };

type EmitAll<T> = UnionToIntersection<EmitSignatures<T>[keyof T]>
