<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePracticeQuestionItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('practice_question_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_question_id')->constrained('practice_questions')->onDelete('cascade');
            $table->enum('level', ['easy', 'medium', 'hard']);
            $table->string('tag');
            $table->longText('question');
            $table->enum('answer_type', ['single', 'multiple']);
            $table->longText('answer_explanation');
            $table->float('mark');
            $table->float('negative_mark');
            $table->boolean('is_first_item')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('practice_question_items');
    }
}
