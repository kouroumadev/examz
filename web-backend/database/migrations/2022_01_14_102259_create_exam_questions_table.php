<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_section_id')->constrained('exam_sections')->onDelete('cascade');
            $table->enum('type', ['paragraph', 'simple']);
            $table->enum('level', ['easy', 'medium', 'hard'])->nullable();
            $table->string('tag')->nullable();
            $table->longText('instruction')->nullable();
            $table->longText('paragraph')->nullable();
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
        Schema::dropIfExists('exam_questions');
    }
}
