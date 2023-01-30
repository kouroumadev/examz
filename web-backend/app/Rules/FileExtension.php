<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class FileExtension implements Rule
{
    /**
     * @var array
     */
    private $extensions;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(array $extensions)
    {
        $this->extensions = $extensions;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $tokens = explode(".", $value);
        $size = count($tokens);
        if ($size < 2) {
            return false;
        }
        return in_array($tokens[$size - 1], $this->extensions);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'file extension is not supported';
    }
}
