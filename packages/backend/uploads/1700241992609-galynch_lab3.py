import sys


def edit_distance(word1, word2):
    x = len(word1)
    y = len(word2)
    array = [[0] * (y + 1) for _ in range(x + 1)]

    # Constructing arrays
    for i in range(x + 1):
        array[i][0] = i
    for j in range(y + 1):
        array[0][j] = j

    # Iterating through words
    for i in range(1, x + 1):
        for j in range(1, y + 1):
            if word1[i - 1] == word2[j - 1]:
                array[i][j] = array[i - 1][j - 1]
            else:
                array[i][j] = 1 + min(array[i - 1][j], array[i][j - 1], array[i - 1][j - 1])

    # Return result
    return array[x][y]


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Error in inputs")
        sys.exit(1)

    result = edit_distance(sys.argv[1], sys.argv[2])
    print(result)
